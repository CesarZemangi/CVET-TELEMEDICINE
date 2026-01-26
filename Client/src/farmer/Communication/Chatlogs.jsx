import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function ChatLogs() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

  const logs = [
    { id: 1, title: "Consultation with Dr. Moyo (Mashonaland dairy herd)", date: "Jan 10, 2026", category: "Consultation", status: "Archived" },
    { id: 2, title: "Follow-up on Mastitis Case (Nguni cow)", date: "Jan 12, 2026", category: "Treatment", status: "Archived" },
    { id: 3, title: "Vaccination Discussion (Newcastle in poultry)", date: "Jan 14, 2026", category: "Vaccination", status: "Archived" },
    { id: 4, title: "Nutrition Advice Session (sorghum stover feeding)", date: "Jan 15, 2026", category: "Nutrition", status: "Archived" },
    { id: 5, title: "Surgical Case Review (fracture fixation)", date: "Jan 17, 2026", category: "Surgery", status: "Archived" },
    { id: 6, title: "Lab Results Explanation (brucellosis tests)", date: "Jan 18, 2026", category: "Lab", status: "Archived" },
    { id: 7, title: "Medication Schedule Clarification (goat deworming)", date: "Jan 20, 2026", category: "Medication", status: "Archived" },
    { id: 8, title: "General Health Check Chat (Midlands communal herd)", date: "Jan 22, 2026", category: "Consultation", status: "Archived" },
    { id: 9, title: "Farmer Feedback Session (tick control program)", date: "Jan 23, 2026", category: "Feedback", status: "Archived" },
    { id: 10, title: "Preventive Screening Consultation (anthrax monitoring)", date: "Jan 25, 2026", category: "Screening", status: "Archived" }
  ]

  const filteredLogs = logs.filter(log =>
    (categoryFilter === "All" ? true : log.category === categoryFilter) &&
    (dateFilter === "All" ? true : log.date.includes(dateFilter))
  )

  return (
    <DashboardSection title="Chat Logs (Zimbabwe)">
      <p>Below are archived veterinary communication records:</p>

      {/* Category filter */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Consultation", "Treatment", "Vaccination", "Nutrition", "Surgery", "Lab", "Medication", "Feedback", "Screening"].map(cat => (
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
      <div className="mb-3 d-flex gap-2">
        {["All", "Jan 10, 2026", "Jan 12, 2026", "Jan 14, 2026", "Jan 15, 2026", "Jan 17, 2026", "Jan 18, 2026", "Jan 20, 2026", "Jan 22, 2026", "Jan 23, 2026", "Jan 25, 2026"].map(date => (
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
        {filteredLogs.map(log => (
          <li key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{log.category}:</strong> {log.title}
            </span>
            <small className="text-muted">{log.date} — {log.status}</small>
          </li>
        ))}
        {filteredLogs.length === 0 && (
          <li className="list-group-item text-muted">No chat logs found for {categoryFilter} on {dateFilter}.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
