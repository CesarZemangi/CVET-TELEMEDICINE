import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";
import { Search, Send, User, MessageCircle, Plus, X, Zap } from "lucide-react";
import "./ChatInterface.css";

export default function ChatInterface({ readOnly = false }) {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const normalizeCaseId = (value) => (value === undefined || value === "null" ? null : value);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = useCallback(async () => {
    try {
      const endpoint = readOnly ? "/admin/chatlogs" : "/communication/conversations";
      const res = await api.get(endpoint);
      const data = res.data.data || res.data;
      setConversations(data);
      return data;
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [readOnly]);

  const fetchMessages = useCallback(async (conv) => {
    try {
      if (conv.isNew) {
        setMessages([]);
        setSelectedConv(conv);
        return;
      }
      
      if (!readOnly && (!conv.partner || !conv.partner.id)) {
        console.error("Invalid conversation object:", conv);
        return;
      }
      
      let endpoint = "/communication/chatlogs";
      let params = { partner_id: conv.partner?.id, case_id: normalizeCaseId(conv.case_id) };
      
      if (readOnly) {
        endpoint = "/admin/chatlogs/thread";
        params = { sender_id: conv.sender_id, receiver_id: conv.receiver_id };
      }
      
      const res = await api.get(endpoint, { params });
      const data = res.data?.data || res.data || [];
      
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(sorted);
      } else {
        console.error("Invalid messages format:", data);
        setMessages([]);
      }
      
      setSelectedConv(conv);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  }, [readOnly]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const init = async () => {
      const convs = await fetchConversations();
      
      // Check for initial state from navigation (e.g., from Cases page)
      if (location.state?.initialPartner) {
        const { initialPartner, initialCaseId } = location.state;
        const existing = convs?.find(
          c => c.partner?.id === initialPartner.id &&
          normalizeCaseId(c.case_id) === normalizeCaseId(initialCaseId)
        );
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
      socket.on("receive_message", async (msg) => {
        if (selectedConv) {
          const partnerId = selectedConv.partner?.id || (selectedConv.sender_id === user.id ? selectedConv.receiver_id : selectedConv.sender_id);
          const isRelatedToSelected = 
            ((msg.sender_id === user.id && msg.receiver_id === partnerId) ||
             (msg.sender_id === partnerId && msg.receiver_id === user.id)) &&
            (normalizeCaseId(msg.case_id) === normalizeCaseId(selectedConv.case_id));
          
          if (isRelatedToSelected) {
            setMessages(prev => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            });
            if (selectedConv.isNew) {
              setSelectedConv(prev => ({...prev, isNew: false}));
            }
            // If message is from partner, mark it as read immediately
            if (msg.sender_id === partnerId) {
              await api.put("/communication/messages/read", { partner_id: partnerId, case_id: normalizeCaseId(msg.case_id) });
            }
          }
        }
        fetchConversations();
      });
    }

    return () => {
      socket.off("receive_message");
    };
  }, [selectedConv, readOnly, location.state, user.id, fetchConversations, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/communication/contacts");
      const data = res.data.data || res.data;
      setContacts(data);
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
      case_id: normalizeCaseId(selectedConv.case_id),
      message: newMessage.trim()
    };

    try {
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        sender_id: user.id,
        receiver_id: payload.receiver_id,
        case_id: payload.case_id,
        message: payload.message,
        created_at: new Date().toISOString(),
        sender: { id: user.id, name: user.name, profile_pic: user.profile_image }
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");
      const res = await api.post("/communication/messages", payload);
      const saved = res.data;

      setMessages(prev => prev.map((m) =>
        m.id === optimisticMessage.id
          ? { ...optimisticMessage, ...saved, sender: saved?.sender || optimisticMessage.sender }
          : m
      ));

      if (selectedConv.isNew) {
        setSelectedConv(prev => ({ ...prev, isNew: false }));
      }
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.filter((m) => !String(m.id).startsWith("temp-")));
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

  if (loading) return (
    <div className="chat-loading">
      <MessageCircle className="animate-pulse" />
      <p>Loading messages...</p>
    </div>
  );

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`chat-container ${readOnly ? 'chat-readonly' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="chat-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="chat-sidebar-header">
          <div className="chat-sidebar-title">
            <MessageCircle className="chat-icon" />
            <span>{readOnly ? 'Chat Logs' : 'Messages'}</span>
          </div>
          {!readOnly && (
            <button 
              onClick={fetchContacts}
              className="chat-new-btn"
              title="New Message"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="chat-close-btn d-md-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="chat-search">
          <Search className="chat-search-icon" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="chat-search-input"
          />
        </div>

        <div className="chat-conversations">
          {conversations.length > 0 ? (
            conversations
              .filter(conv => {
                const partnerName = (readOnly ? (conv.sender_id === user.id ? conv.receiver : conv.sender) : conv.partner)?.name || '';
                return partnerName.toLowerCase().includes(sidebarSearch.toLowerCase());
              })
              .map((conv, idx) => {
                const partner = readOnly ? (conv.sender_id === user.id ? conv.receiver : conv.sender) : conv.partner;
                const lastMessage = readOnly ? conv.message : conv.lastMessage;
                const lastTime = readOnly ? conv.created_at : conv.lastTime;
                const displayPartner = partner || { name: 'Unknown', role: 'user' };
                const isSelected = readOnly 
                  ? (selectedConv?.sender_id === conv.sender_id && selectedConv?.receiver_id === conv.receiver_id)
                  : (selectedConv?.partner?.id === displayPartner.id && selectedConv?.case_id === conv.case_id);

                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      fetchMessages(readOnly ? { ...conv, partner: displayPartner } : conv);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`chat-conversation-item ${isSelected ? 'active' : ''}`}
                  >
                    <div className="chat-avatar">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="chat-conv-content">
                      <div className="chat-conv-header">
                        <h3 className="chat-conv-name">
                          {readOnly 
                            ? `${conv.sender?.name || 'User'} & ${conv.receiver?.name || 'User'}`
                            : displayPartner.name}
                        </h3>
                        <span className="chat-conv-time">
                          {new Date(lastTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="chat-conv-message">{lastMessage}</p>
                      {conv.case_id && <span className="chat-case-tag">Case #{conv.case_id}</span>}
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="chat-badge">{conv.unread_count}</span>
                    )}
                  </div>
                );
              })
          ) : (
            <div className="chat-empty">
              <MessageCircle className="w-12 h-12" />
              <p>No conversations yet</p>
              <small>Start a new conversation to begin</small>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedConv ? (
          <>
            <div className="chat-header">
              <div className="chat-header-left">
                {isMobile && (
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="chat-menu-btn"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                )}
                <div className="chat-header-avatar">
                  <User className="w-5 h-5" />
                  <span className="chat-online-dot"></span>
                </div>
                <div className="chat-header-info">
                  <h3 className="chat-header-name">
                    {readOnly 
                      ? `${selectedConv.sender?.name || 'Sender'} & ${selectedConv.receiver?.name || 'Receiver'}`
                      : selectedConv.partner.name}
                  </h3>
                  <p className="chat-header-status">
                    {readOnly ? 'Monitoring Conversation' : `Online • ${selectedConv.partner.role}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length > 0 ? messages.map((msg, idx) => {
                const initiatorId = messages[0]?.sender_id;
                const isMine = readOnly 
                  ? msg.sender_id !== initiatorId
                  : msg.sender_id === user.id;
                const senderName = msg.sender?.name || 'Unknown';
                return (
                  <div key={idx} className={`chat-message ${isMine ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      <p className="chat-sender-name">{senderName}</p>
                      <p className="chat-text">{msg.message}</p>
                      <span className="chat-time">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="chat-empty-state">
                  <MessageCircle className="w-16 h-16" />
                  <p>Start of a new conversation</p>
                  <small>Messages will appear here</small>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!readOnly && (
              <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="chat-send-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="chat-no-selection">
            <div className="chat-welcome-icon">
              <Zap className="w-16 h-16" />
            </div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list or start a new one</p>
            {!readOnly && conversations.length === 0 && (
              <button 
                onClick={fetchContacts}
                className="chat-start-btn"
              >
                <Plus className="w-4 h-4" />
                Start New Chat
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <div className="chat-modal-header">
              <h3>New Message</h3>
              <button onClick={() => setShowNewChatModal(false)} className="chat-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="chat-modal-search">
              <Search className="chat-search-icon" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="chat-search-input"
              />
            </div>
            <div className="chat-modal-contacts">
              {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => startNewChat(contact)}
                  className="chat-contact-item"
                >
                  <div className="chat-avatar">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="chat-contact-info">
                    <p className="chat-contact-name">{contact.name}</p>
                    <p className="chat-contact-role">{contact.role}</p>
                  </div>
                </div>
              )) : (
                <div className="chat-modal-empty">No contacts found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
