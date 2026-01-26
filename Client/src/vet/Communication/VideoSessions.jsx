import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function VideoSessions() {
  const sessions = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", species: "Cattle", topic: "Mastitis treatment follow-up", date: "02 Jan 2026", status: "Completed" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", species: "Goats", topic: "Hoof care consultation", date: "03 Jan 2026", status: "Completed" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", species: "Poultry", topic: "Newcastle disease prevention", date: "04 Jan 2026", status: "Completed" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", species: "Cattle", topic: "Digestive disorder case", date: "05 Jan 2026", status: "Completed" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", species: "Goats", topic: "Skin dermatitis treatment", date: "06 Jan 2026", status: "Completed" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", species: "Sheep", topic: "Nutritional deficiency check", date: "07 Jan 2026", status: "Completed" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", species: "Cattle", topic: "Vaccination schedule discussion", date: "08 Jan 2026", status: "Completed" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", species: "Goats", topic: "Parasite infection follow-up", date: "09 Jan 2026", status: "Completed" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", species: "Sheep", topic: "Joint pain management", date: "10 Jan 2026", status: "Completed" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", species: "Cattle", topic: "Rabies vaccine consultation", date: "11 Jan 2026", status: "Completed" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredSessions = sessions.filter(session =>
    filter === "All" ? true : session.species === filter
  )

  return (
    <DashboardSection title="Video Sessions">
      <p className="mb-3">Archived veterinary video consultations with Zimbabwean farmers:</p>

      <div className="mb-3 d-flex gap-2">
        {["All", "Cattle", "Goats", "Poultry", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${filter === species ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      <ul className="list-group">
        {filteredSessions.map(session => (
          <li key={session.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{session.farmer} • {session.animal} • {session.topic}</span>
            <small className="text-muted">{session.date} — {session.status}</small>
          </li>
        ))}
        {filteredSessions.length === 0 && (
          <li className="list-group-item text-muted">No sessions found for {filter}.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
