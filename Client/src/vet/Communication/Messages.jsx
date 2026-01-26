import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Messages() {
  const initialMessages = [
    { id: 1, farmer: "Farmer Raj", subject: "Follow-up on mastitis treatment", date: "02 Jan 2026", status: "Unread" },
    { id: 2, farmer: "Farmer Anita", subject: "Hoof care advice needed", date: "03 Jan 2026", status: "Unread" },
    { id: 3, farmer: "Farmer Kumar", subject: "Respiratory infection update", date: "04 Jan 2026", status: "Read" },
    { id: 4, farmer: "Farmer Meena", subject: "Digestive disorder consultation", date: "05 Jan 2026", status: "Unread" },
    { id: 5, farmer: "Farmer Joseph", subject: "Skin dermatitis treatment feedback", date: "06 Jan 2026", status: "Read" },
    { id: 6, farmer: "Farmer Patel", subject: "Nutritional deficiency plan query", date: "07 Jan 2026", status: "Unread" },
    { id: 7, farmer: "Farmer Gupta", subject: "Vaccination schedule clarification", date: "08 Jan 2026", status: "Read" },
    { id: 8, farmer: "Farmer Rao", subject: "Parasite infection follow-up", date: "09 Jan 2026", status: "Unread" },
    { id: 9, farmer: "Farmer Sharma", subject: "Joint pain management advice", date: "10 Jan 2026", status: "Read" },
    { id: 10, farmer: "Farmer Kumar", subject: "Rabies vaccine consultation", date: "11 Jan 2026", status: "Unread" }
  ]

  const [messages, setMessages] = useState(initialMessages)

  const markAsRead = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: "Read" } : msg
    ))
  }

  const archiveMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  const replyMessage = (farmer, subject) => {
    alert(`Replying to ${farmer} about "${subject}"...`)
  }

  return (
    <DashboardSection title="Messages">
      <p className="mb-3">Farmer messages awaiting vet response:</p>
      <ul className="list-group">
        {messages.map(msg => (
          <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{msg.farmer}</strong> • {msg.subject}
              <br />
              <small className={msg.status === "Unread" ? "text-danger" : "text-muted"}>
                {msg.date} — {msg.status}
              </small>
            </div>
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-brown" onClick={() => replyMessage(msg.farmer, msg.subject)}>Reply</button>
              <button className="btn btn-sm btn-outline-success" onClick={() => markAsRead(msg.id)}>Mark Read</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => archiveMessage(msg.id)}>Archive</button>
            </div>
          </li>
        ))}
        {messages.length === 0 && (
          <li className="list-group-item text-muted">No messages available.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
