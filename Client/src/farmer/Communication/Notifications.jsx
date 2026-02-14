import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Notifications() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetch(
      `/api/communication/notifications?category=${categoryFilter}&date=${dateFilter}`
    )
      .then(res => res.json())
      .then(data => setNotifications(Array.isArray(data) ? data : (data.notifications || [])))
      .catch(err => console.error(err))
  }, [categoryFilter, dateFilter])

  return (
    <DashboardSection title="Notifications (Zimbabwe)">
      <p>Recent alerts and updates.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {[
          "All",
          "Consultation",
          "Lab",
          "Vaccination",
          "Medication",
          "Communication",
          "Screening",
          "Nutrition",
          "System",
          "Feedback"
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

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {[
          "All",
          "Jan 26, 2026",
          "Jan 25, 2026",
          "Jan 24, 2026",
          "Jan 23, 2026",
          "Jan 22, 2026",
          "Jan 21, 2026",
          "Jan 20, 2026",
          "Jan 19, 2026",
          "Jan 18, 2026",
          "Jan 17, 2026"
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
        {notifications.map(note => (
          <li
            key={note.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{note.title}:</strong> {note.message}
            </div>
            <small className="text-muted">{new Date(note.created_at).toLocaleDateString()}</small>
          </li>
        ))}

        {notifications.length === 0 && (
          <li className="list-group-item text-muted">
            No notifications found for {categoryFilter} on {dateFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
