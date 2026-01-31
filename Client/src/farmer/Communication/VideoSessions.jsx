import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function VideoSessions() {
  const [vetFilter, setVetFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetch(`/api/video-sessions?vet=${vetFilter}&topic=${topicFilter}`)
      .then(res => res.json())
      .then(data => setSessions(data.sessions))
      .catch(err => console.error(err))
  }, [vetFilter, topicFilter])

  const completedSessions = sessions.filter(s => s.status === "Completed")
  const upcomingSessions = sessions.filter(s => s.status === "Upcoming")

  return (
    <DashboardSection title="Video Sessions (Zimbabwe)">
      <p>Recent and upcoming video consultations.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All","Dr. Moyo","Dr. Ncube","Dr. Dube","Dr. Sibanda","Dr. Mutasa","Dr. Chirwa","Dr. Nkomo"].map(vet => (
          <button
            key={vet}
            className={`btn btn-sm ${vetFilter === vet ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setVetFilter(vet)}
          >
            {vet}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All","Consultation","Nutrition","Screening","Surgery","Medication","Vaccination","Feedback"].map(topic => (
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
        {completedSessions.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.title}</span>
            <small className="text-muted">{s.date}</small>
          </li>
        ))}
        {completedSessions.length === 0 && (
          <li className="list-group-item text-muted">
            No completed sessions found for {vetFilter} in {topicFilter}.
          </li>
        )}
      </ul>

      <h6 className="fw-semibold mt-3">📅 Upcoming Sessions</h6>
      <ul className="list-group">
        {upcomingSessions.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.title}</span>
            <small className="text-muted">{s.date}</small>
          </li>
        ))}
        {upcomingSessions.length === 0 && (
          <li className="list-group-item text-muted">
            No upcoming sessions found for {vetFilter} in {topicFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
