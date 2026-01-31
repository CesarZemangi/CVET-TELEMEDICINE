import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Messages() {
  const [senderFilter, setSenderFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch(
      `/api/messages?sender=${senderFilter}&topic=${topicFilter}`
    )
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages)
      })
      .catch(err => console.error(err))
  }, [senderFilter, topicFilter])

  return (
    <DashboardSection title="Messages (Zimbabwe)">
      <p>Recent messages from vets and support staff.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {[
          "All",
          "Dr. Moyo",
          "Dr. Ncube",
          "Vet Clinic Harare",
          "Dr. Dube",
          "Dr. Sibanda",
          "Vet Support Midlands",
          "Dr. Mutasa",
          "Dr. Chirwa",
          "Vet Clinic Bulawayo",
          "Dr. Nkomo"
        ].map(sender => (
          <button
            key={sender}
            className={`btn btn-sm ${
              senderFilter === sender
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setSenderFilter(sender)}
          >
            {sender}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {[
          "All",
          "Lab",
          "Consultation",
          "Vaccination",
          "Nutrition",
          "Surgery",
          "Medication",
          "Screening",
          "Compliance"
        ].map(topic => (
          <button
            key={topic}
            className={`btn btn-sm ${
              topicFilter === topic
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setTopicFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {messages.map(msg => (
          <li
            key={msg.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{msg.sender}</strong>
              <br />
              <span className="text-dark">{msg.subject}</span>
            </div>
            <small className="text-muted">{msg.date}</small>
          </li>
        ))}

        {messages.length === 0 && (
          <li className="list-group-item text-muted">
            No messages found for {senderFilter} in {topicFilter}.
          </li>
        )}
      </ul>
    </DashboardSection>
  )
}
