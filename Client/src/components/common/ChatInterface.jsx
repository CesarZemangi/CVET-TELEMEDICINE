import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";
import { Search, Send, User, MessageCircle, MoreVertical, Plus, X } from "lucide-react";

export default function ChatInterface({ readOnly = false }) {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const endpoint = readOnly ? "/admin/chat-logs" : "/communication/conversations";
      const res = await api.get(endpoint);
      setConversations(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const convs = await fetchConversations();
      
      // Check for initial state from navigation (e.g., from Cases page)
      if (location.state?.initialPartner) {
        const { initialPartner, initialCaseId } = location.state;
        const existing = convs?.find(c => c.partner.id === initialPartner.id && c.case_id === initialCaseId);
        if (existing) {
          fetchMessages(existing);
        } else {
          const tempConv = {
            partner: initialPartner,
            case_id: initialCaseId,
            isNew: true
          };
          setSelectedConv(tempConv);
          setMessages([]);
        }
      }
    };
    init();
    
    // Socket setup
    if (!socket.connected && !readOnly) {
      socket.connect();
    }

    if (!readOnly) {
      socket.on("receive_message", (msg) => {
        if (selectedConv) {
          const partnerId = selectedConv.partner?.id || (selectedConv.sender_id === user.id ? selectedConv.receiver_id : selectedConv.sender_id);
          const isRelatedToSelected = 
            (msg.sender_id === user.id && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === user.id);
          
          if (isRelatedToSelected) {
            setMessages(prev => [...prev, msg]);
            if (selectedConv.isNew) {
              setSelectedConv(prev => ({...prev, isNew: false}));
            }
          }
        }
        fetchConversations();
      });
    }

    return () => {
      socket.off("receive_message");
    };
  }, [selectedConv?.partner?.id, readOnly, location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (conv) => {
    try {
      if (conv.isNew) {
        setMessages([]);
        setSelectedConv(conv);
        return;
      }
      const res = await api.get("/communication/chatlogs", {
        params: { partner_id: conv.partner.id, case_id: conv.case_id }
      });
      setMessages(res.data);
      setSelectedConv(conv);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get("/communication/contacts");
      setContacts(res.data);
      setShowNewChatModal(true);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || readOnly) return;

    const payload = {
      receiver_id: selectedConv.partner.id,
      case_id: selectedConv.case_id,
      message: newMessage
    };

    try {
      socket.emit("send_message", payload);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const startNewChat = (contact) => {
    const existing = conversations.find(c => c.partner.id === contact.id && !c.case_id);
    if (existing) {
      fetchMessages(existing);
    } else {
      const tempConv = {
        partner: contact,
        case_id: null,
        isNew: true
      };
      setSelectedConv(tempConv);
      setMessages([]);
    }
    setShowNewChatModal(false);
  };

  if (loading) return <div className="p-4 text-center">Loading chats...</div>;

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`flex bg-white rounded-xl shadow-sm overflow-hidden border ${readOnly ? 'h-[500px]' : 'h-[calc(100vh-160px)]'}`}>
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-brown-600" />
              {readOnly ? 'Chat Logs' : 'Messages'}
            </h2>
            {!readOnly && (
              <button 
                onClick={fetchContacts}
                className="p-1.5 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
                title="New Message"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-brown-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv, idx) => {
              const partner = readOnly ? (conv.sender_id === user.id ? conv.receiver : conv.sender) : conv.partner;
              const lastMessage = readOnly ? conv.message : conv.lastMessage;
              const lastTime = readOnly ? conv.created_at : conv.lastTime;
              const displayPartner = partner || { name: 'Unknown', role: 'user' };

              return (
                <div 
                  key={idx}
                  onClick={() => fetchMessages(readOnly ? { partner: displayPartner, case_id: conv.case_id } : conv)}
                  className={`p-4 border-b cursor-pointer transition-colors flex items-center gap-3 ${selectedConv?.partner.id === displayPartner.id && selectedConv?.case_id === conv.case_id ? 'bg-brown-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">{displayPartner.name}</h3>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(lastTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{lastMessage}</p>
                    {conv.case_id && <span className="text-[9px] text-blue-600">Case #{conv.case_id}</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {selectedConv ? (
          <>
            <div className="p-3 border-b bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedConv.partner.name}</h3>
                  <p className="text-[10px] text-gray-500 capitalize">{selectedConv.partner.role}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.length > 0 ? messages.map((msg, idx) => {
                const isMine = msg.sender_id === user.id;
                return (
                  <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-1.5 rounded-xl shadow-sm ${
                      isMine ? 'bg-brown-600 text-white' : 'bg-white text-gray-800 border'
                    }`}>
                      <p className="text-xs">{msg.message}</p>
                      <span className={`text-[9px] mt-1 block ${isMine ? 'text-brown-100' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                  Start of a new conversation
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!readOnly && (
              <div className="p-3 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-1.5 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-brown-500"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center hover:bg-brown-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Select a conversation or start a new one</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">New Message</h3>
              <button onClick={() => setShowNewChatModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 bg-gray-50 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-brown-500 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => startNewChat(contact)}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <p className="font-semibold text-sm">{contact.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{contact.role}</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500 text-sm">No contacts found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}