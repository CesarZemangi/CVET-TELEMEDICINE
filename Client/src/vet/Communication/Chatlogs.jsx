import React, { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function ChatLogs() {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/communication/chatlogs")
      .then(res => res.json())
      .then(data => setLogs(Array.isArray(data) ? data : (data.logs || [])))
      .catch(err => console.error(err))
  }, [])

  const filteredChats = logs.filter(log =>
    (log.message?.toLowerCase().includes(search.toLowerCase())) ||
    (log.sender?.name?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <DashboardSection title="Chat Logs">
      <p className="mb-3">Archived telemedicine chats with farmers:</p>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by message or user..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ul className="list-group">
        {filteredChats.map(log => (
          <li key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{log.sender?.name || "User"}:</strong> {log.message}
            </span>
            <small className="text-muted">
              {new Date(log.created_at).toLocaleDateString()} , {log.is_read ? "Read" : "Unread"}
            </small>
          </li>
        ))}
        {filteredChats.length === 0 && (
          <li className="list-group-item text-muted">No chats found.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
