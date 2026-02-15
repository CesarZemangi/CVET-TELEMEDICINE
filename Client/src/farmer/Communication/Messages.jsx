import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import api from "../../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/communication/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const replyMessage = (sender) => {
    alert(`Replying to ${sender}...`)
  }

  const markAsRead = (id) => {
    console.log("Marking as read", id);
  }

  return (
    <DashboardSection title="Messages">
      <p className="mb-3">Recent messages from vets and support staff.</p>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-brown" role="status"></div>
          <p className="mt-2 text-muted">Loading messages...</p>
        </div>
      ) : (
        <ul className="list-group shadow-sm">
          {messages.map(msg => (
            <li
              key={msg.id}
              className="list-group-item d-flex justify-content-between align-items-center p-3"
            >
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <span className="fw-bold text-brown me-2">{msg.sender?.name || "Support"}</span>
                  <small className="badge bg-light text-muted border">{new Date(msg.created_at).toLocaleString()}</small>
                </div>
                <div className="text-dark small">{msg.message}</div>
              </div>
              <div className="ms-3 d-flex gap-2">
                <button 
                  className="btn btn-sm btn-brown"
                  onClick={() => replyMessage(msg.sender?.name)}
                >
                  Reply
                </button>
                <button 
                  className="btn btn-sm btn-outline-brown"
                  onClick={() => markAsRead(msg.id)}
                >
                  <i className="bi bi-check-all"></i>
                </button>
              </div>
            </li>
          ))}

          {messages.length === 0 && (
            <li className="list-group-item text-center py-5">
              <div className="text-muted mb-2">
                <i className="bi bi-chat-dots" style={{fontSize: '2rem'}}></i>
              </div>
              <p className="mb-0">No messages found in your inbox.</p>
            </li>
          )}
        </ul>
      )}
    </DashboardSection>
  )
}
