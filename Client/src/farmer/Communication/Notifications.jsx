import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Notifications() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

  const notifications = [
    { id: 1, message: "Upcoming consultation scheduled for tomorrow at 10:00 AM (Mashonaland dairy herd).", category: "Consultation", date: "Jan 26, 2026" },
    { id: 2, message: "Lab results for Case #1023 (brucellosis tests) are now available.", category: "Lab", date: "Jan 25, 2026" },
    { id: 3, message: "Vaccination reminder: 15 cattle due for booster shots this week (rabies).", category: "Vaccination", date: "Jan 24, 2026" },
    { id: 4, message: "Medication schedule updated for herd A (goat deworming).", category: "Medication", date: "Jan 23, 2026" },
    { id: 5, message: "New message received from Dr. Ncube.", category: "Communication", date: "Jan 22, 2026" },
    { id: 6, message: "Preventive screening results uploaded for Case #1018 (anthrax monitoring).", category: "Screening", date: "Jan 21, 2026" },
    { id: 7, message: "Nutrition report available for January (sorghum stover feeding).", category: "Nutrition", date: "Jan 20, 2026" },
    { id: 8, message: "System update: Dashboard performance improvements applied.", category: "System", date: "Jan 19, 2026" },
    { id: 9, message: "Follow-up consultation scheduled for Feb 2, 2026 (Midlands communal herd).", category: "Consultation", date: "Jan 18, 2026" },
    { id: 10, message: "Farmer feedback submitted for last consultation (tick control program).", category: "Feedback", date: "Jan 17, 2026" }
  ]

  const filteredNotifications = notifications.filter(note =>
    (categoryFilter === "All" ? true : note.category === categoryFilter) &&
    (dateFilter === "All" ? true : note.date === dateFilter)
  )

  return (
    <DashboardSection title="Notifications (Zimbabwe)">
      <p>Recent alerts and updates:</p>

      {/* Category filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Consultation", "Lab", "Vaccination", "Medication", "Communication", "Screening", "Nutrition", "System", "Feedback"].map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${categoryFilter === cat ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Jan 26, 2026", "Jan 25, 2026", "Jan 24, 2026", "Jan 23, 2026", "Jan 22, 2026", "Jan 21, 2026", "Jan 20, 2026", "Jan 19, 2026", "Jan 18, 2026", "Jan 17, 2026"].map(date => (
          <button
            key={date}
            className={`btn btn-sm ${dateFilter === date ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setDateFilter(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {filteredNotifications.map(note => (
          <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{note.category}:</strong> {note.message}
            </div>
            <small className="text-muted">{note.date}</small>
          </li>
        ))}
        {filteredNotifications.length === 0 && (
          <li className="list-group-item text-muted">
            No notifications found for {categoryFilter} on {dateFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
