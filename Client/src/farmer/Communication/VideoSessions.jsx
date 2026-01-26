import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function VideoSessions() {
  const [vetFilter, setVetFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")

  const sessions = [
    { id: 1, title: "Consultation with Dr. Moyo (Mashonaland dairy herd)", vet: "Dr. Moyo", topic: "Consultation", date: "Jan 10, 2026", status: "Completed" },
    { id: 2, title: "Follow-up with Dr. Ncube (mastitis case)", vet: "Dr. Ncube", topic: "Consultation", date: "Jan 12, 2026", status: "Completed" },
    { id: 3, title: "Nutrition Advice Session (sorghum stover feeding)", vet: "Dr. Dube", topic: "Nutrition", date: "Jan 14, 2026", status: "Completed" },
    { id: 4, title: "Preventive Screening Consultation (anthrax monitoring)", vet: "Dr. Sibanda", topic: "Screening", date: "Jan 15, 2026", status: "Completed" },
    { id: 5, title: "Surgical Case Review (fracture fixation)", vet: "Dr. Mutasa", topic: "Surgery", date: "Jan 17, 2026", status: "Completed" },
    { id: 6, title: "Medication Schedule Clarification (goat deworming)", vet: "Dr. Chirwa", topic: "Medication", date: "Jan 18, 2026", status: "Completed" },
    { id: 7, title: "General Health Check (Midlands communal herd)", vet: "Dr. Moyo", topic: "Consultation", date: "Jan 20, 2026", status: "Upcoming" },
    { id: 8, title: "Vaccination Discussion (Newcastle in poultry)", vet: "Dr. Nkomo", topic: "Vaccination", date: "Jan 22, 2026", status: "Upcoming" },
    { id: 9, title: "Farmer Feedback Session (tick control program)", vet: "Dr. Dube", topic: "Feedback", date: "Jan 23, 2026", status: "Upcoming" },
    { id: 10, title: "Consultation with Dr. Chirwa (dairy herd management)", vet: "Dr. Chirwa", topic: "Consultation", date: "Jan 25, 2026", status: "Upcoming" }
  ]

  const filteredSessions = sessions.filter(session =>
    (vetFilter === "All" ? true : session.vet === vetFilter) &&
    (topicFilter === "All" ? true : session.topic === topicFilter)
  )

  const completedSessions = filteredSessions.filter(s => s.status === "Completed")
  const upcomingSessions = filteredSessions.filter(s => s.status === "Upcoming")

  return (
    <DashboardSection title="Video Sessions (Zimbabwe)">
      <p>Recent and upcoming video consultations:</p>

      {/* Vet filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Dr. Moyo", "Dr. Ncube", "Dr. Dube", "Dr. Sibanda", "Dr. Mutasa", "Dr. Chirwa", "Dr. Nkomo"].map(vet => (
          <button
            key={vet}
            className={`btn btn-sm ${vetFilter === vet ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setVetFilter(vet)}
          >
            {vet}
          </button>
        ))}
      </div>

      {/* Topic filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Consultation", "Nutrition", "Screening", "Surgery", "Medication", "Vaccination", "Feedback"].map(topic => (
          <button
            key={topic}
            className={`btn btn-sm ${topicFilter === topic ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setTopicFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <h6 className="fw-semibold mt-3">✅ Completed Sessions</h6>
      <ul className="list-group mb-3">
        {completedSessions.map(session => (
          <li key={session.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{session.title}</span>
            <small className="text-muted">{session.date}</small>
          </li>
        ))}
        {completedSessions.length === 0 && (
          <li className="list-group-item text-muted">No completed sessions found for {vetFilter} in {topicFilter}.</li>
        )}
      </ul>

      <h6 className="fw-semibold mt-3">📅 Upcoming Sessions</h6>
      <ul className="list-group">
        {upcomingSessions.map(session => (
          <li key={session.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{session.title}</span>
            <small className="text-muted">{session.date}</small>
          </li>
        ))}
        {upcomingSessions.length === 0 && (
          <li className="list-group-item text-muted">No upcoming sessions found for {vetFilter} in {topicFilter}.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
