import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function ChatLogs() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch(
      `/api/chats/logs?category=${categoryFilter}&date=${dateFilter}`
    )
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs)
      })
      .catch(err => console.error(err))
  }, [categoryFilter, dateFilter])

  return (
    <DashboardSection title="Chat Logs (Zimbabwe)">
      <p>Archived veterinary communication records.</p>

      <div className="mb-3 d-flex gap-2">
        {[
          "All",
          "Consultation",
          "Treatment",
          "Vaccination",
          "Nutrition",
          "Surgery",
          "Lab",
          "Medication",
          "Feedback",
          "Screening"
        ].map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${
              categoryFilter === cat
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2">
        {[
          "All",
          "Jan 10, 2026",
          "Jan 12, 2026",
          "Jan 14, 2026",
          "Jan 15, 2026",
          "Jan 17, 2026",
          "Jan 18, 2026",
          "Jan 20, 2026",
          "Jan 22, 2026",
          "Jan 23, 2026",
          "Jan 25, 2026"
        ].map(date => (
          <button
            key={date}
            className={`btn btn-sm ${
              dateFilter === date
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setDateFilter(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {logs.map(log => (
          <li
            key={log.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{log.category}:</strong> {log.title}
            </span>
            <small className="text-muted">
              {log.date} , {log.status}
            </small>
          </li>
        ))}

        {logs.length === 0 && (
          <li className="list-group-item text-muted">
            No chat logs found for {categoryFilter} on {dateFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
