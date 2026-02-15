import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";
import api from "../../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);
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

  const markAsRead = async (id) => {
    // Backend markAsRead logic here if available for messages
    console.log("Marking as read", id);
  }

  const archiveMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  const replyMessage = (sender, subject) => {
    alert(`Replying to ${sender} about case...`)
  }

  return (
    <DashboardSection title="Messages">
      <p className="mb-3">Farmer messages awaiting vet response:</p>
      {loading ? (
        <div className="text-center py-4">Loading messages...</div>
      ) : (
        <ul className="list-group">
          {messages.map(msg => (
            <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{msg.sender?.name || "Farmer"}</strong> • {msg.message.substring(0, 50)}...
                <br />
                <small className="text-muted">
                  {new Date(msg.created_at).toLocaleString()}
                </small>
              </div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-brown" onClick={() => replyMessage(msg.sender?.name, msg.message)}>Reply</button>
                <button className="btn btn-sm btn-outline-success" onClick={() => markAsRead(msg.id)}>Mark Read</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => archiveMessage(msg.id)}>Archive</button>
              </div>
            </li>
          ))}
          {messages.length === 0 && (
            <li className="list-group-item text-muted">No messages available.</li>
          )}
        </ul>
      )}
    </DashboardSection>
  )
}
