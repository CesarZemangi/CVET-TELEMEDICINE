import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Messages() {
  const [senderFilter, setSenderFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")

  const messages = [
    { id: 1, sender: "Dr. Moyo", subject: "Lab results ready (brucellosis tests)", topic: "Lab", date: "Jan 10, 2026" },
    { id: 2, sender: "Dr. Ncube", subject: "Follow-up consultation scheduled (mastitis case)", topic: "Consultation", date: "Jan 12, 2026" },
    { id: 3, sender: "Vet Clinic Harare", subject: "Vaccination reminder (Newcastle in poultry)", topic: "Vaccination", date: "Jan 14, 2026" },
    { id: 4, sender: "Dr. Dube", subject: "Nutrition plan update (sorghum stover feeding)", topic: "Nutrition", date: "Jan 15, 2026" },
    { id: 5, sender: "Dr. Sibanda", subject: "Surgical case review (fracture fixation)", topic: "Surgery", date: "Jan 17, 2026" },
    { id: 6, sender: "Vet Support Midlands", subject: "Medication schedule clarification (goat deworming)", topic: "Medication", date: "Jan 18, 2026" },
    { id: 7, sender: "Dr. Mutasa", subject: "Preventive screening results (anthrax monitoring)", topic: "Screening", date: "Jan 20, 2026" },
    { id: 8, sender: "Dr. Chirwa", subject: "General health check feedback (communal herd)", topic: "Consultation", date: "Jan 22, 2026" },
    { id: 9, sender: "Vet Clinic Bulawayo", subject: "Farmer compliance report (tick control)", topic: "Compliance", date: "Jan 23, 2026" },
    { id: 10, sender: "Dr. Nkomo", subject: "Consultation notes shared (dairy herd management)", topic: "Consultation", date: "Jan 25, 2026" }
  ]

  const filteredMessages = messages.filter(msg =>
    (senderFilter === "All" ? true : msg.sender === senderFilter) &&
    (topicFilter === "All" ? true : msg.topic === topicFilter)
  )

  return (
    <DashboardSection title="Messages (Zimbabwe)">
      <p>Recent messages from vets and support staff:</p>

      {/* Sender filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Dr. Moyo", "Dr. Ncube", "Vet Clinic Harare", "Dr. Dube", "Dr. Sibanda", "Vet Support Midlands", "Dr. Mutasa", "Dr. Chirwa", "Vet Clinic Bulawayo", "Dr. Nkomo"].map(sender => (
          <button
            key={sender}
            className={`btn btn-sm ${senderFilter === sender ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setSenderFilter(sender)}
          >
            {sender}
          </button>
        ))}
      </div>

      {/* Topic filter */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Lab", "Consultation", "Vaccination", "Nutrition", "Surgery", "Medication", "Screening", "Compliance"].map(topic => (
          <button
            key={topic}
            className={`btn btn-sm ${topicFilter === topic ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setTopicFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {filteredMessages.map(msg => (
          <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{msg.sender}</strong>
              <br />
              <span className="text-dark">{msg.subject}</span>
            </div>
            <small className="text-muted">{msg.date}</small>
          </li>
        ))}
        {filteredMessages.length === 0 && (
          <li className="list-group-item text-muted">
            No messages found for {senderFilter} in {topicFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
