import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';
import ProfileImage from './ProfileImage';

export default function ChatWindow({ caseId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/communication/messages/${caseId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Socket listeners
    socket.emit('join_case', { case_id: caseId });
    
    const handleReceive = (msg) => {
      if (msg.case_id === parseInt(caseId)) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [caseId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload = { case_id: caseId, message: newMessage };
      
      // Send via HTTP
      await api.post('/communication/messages', payload);
      
      // Also emit via socket for real-time
      socket.emit('send_message', payload);
      
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading conversation...</div>;

  return (
    <div className="card border-0 shadow-sm overflow-hidden d-flex flex-column" style={{ height: '500px', borderRadius: '15px' }}>
      {/* Header */}
      <div className="card-header bg-white border-0 py-3">
        <h6 className="mb-0 fw-bold"><i className="bi bi-chat-dots me-2 text-primary"></i> Case Discussion #{caseId}</h6>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="card-body bg-light bg-opacity-50 overflow-auto p-4 d-flex flex-column gap-3"
        style={{ flex: 1 }}
      >
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id || idx} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
              {!isMe && (
                <ProfileImage 
                  src={msg.sender?.profile_pic} 
                  role={msg.sender?.role || 'vet'} 
                  size="32px" 
                  className="me-2 mt-auto" 
                />
              )}
              <div className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`} style={{ maxWidth: '75%' }}>
                <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                     style={{ 
                       borderRadius: isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                       boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                     }}>
                  <p className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.message}</p>
                </div>
                <small className="text-muted mt-1 px-1" style={{ fontSize: '0.65rem' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-center my-auto opacity-50">
            <i className="bi bi-chat-left-dots fs-1"></i>
            <p className="mt-2">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="card-footer bg-white border-top p-3">
        <form onSubmit={handleSend} className="d-flex gap-2 align-items-center">
          <div className="flex-grow-1 position-relative">
            <input 
              type="text" 
              className="form-control border-0 bg-light py-2 ps-3" 
              placeholder="Write your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ borderRadius: '25px', fontSize: '0.9rem' }}
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
            style={{ width: '40px', height: '40px' }}
            disabled={!newMessage.trim()}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
