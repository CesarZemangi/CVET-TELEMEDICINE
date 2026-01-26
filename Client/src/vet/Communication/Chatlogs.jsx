import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function ChatLogs() {
  const chats = [
    { id: 1, animal: "Cow #A12", vet: "Dr. Kumar", topic: "Mastitis treatment", date: "02 Jan 2026" },
    { id: 2, animal: "Goat #B07", vet: "Dr. Rao", topic: "Hoof care advice", date: "03 Jan 2026" },
    { id: 3, animal: "Sheep #C21", vet: "Dr. Meena", topic: "Respiratory infection follow-up", date: "04 Jan 2026" },
    { id: 4, animal: "Cow #A15", vet: "Dr. Patel", topic: "Digestive disorder consultation", date: "05 Jan 2026" },
    { id: 5, animal: "Goat #B11", vet: "Dr. Sharma", topic: "Skin dermatitis treatment", date: "06 Jan 2026" },
    { id: 6, animal: "Sheep #C09", vet: "Dr. Joseph", topic: "Nutritional deficiency check", date: "07 Jan 2026" },
    { id: 7, animal: "Cow #A18", vet: "Dr. Gupta", topic: "Vaccination schedule discussion", date: "08 Jan 2026" },
    { id: 8, animal: "Goat #B14", vet: "Dr. Kumar", topic: "Parasite infection follow-up", date: "09 Jan 2026" },
    { id: 9, animal: "Sheep #C25", vet: "Dr. Rao", topic: "Joint pain management", date: "10 Jan 2026" },
    { id: 10, animal: "Cow #A20", vet: "Dr. Meena", topic: "Rabies vaccine consultation", date: "11 Jan 2026" }
  ]

  const [search, setSearch] = useState("")

  const filteredChats = chats.filter(chat =>
    chat.animal.toLowerCase().includes(search.toLowerCase()) ||
    chat.vet.toLowerCase().includes(search.toLowerCase()) ||
    chat.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardSection title="Chat Logs">
      <p className="mb-3">Archived telemedicine chats with veterinarians:</p>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by animal, vet, or topic..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ul className="list-group">
        {filteredChats.map(chat => (
          <li key={chat.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{chat.animal} • {chat.vet} • {chat.topic}</span>
            <small className="text-muted">{chat.date}</small>
          </li>
        ))}
        {filteredChats.length === 0 && (
          <li className="list-group-item text-muted">No chats found.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
