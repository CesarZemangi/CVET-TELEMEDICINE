import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Feedback() {
  const feedbacks = [
    { id: 1, farmer: "Farmer Raj", animal: "Cow #A12", rating: 5, comment: "Excellent guidance on mastitis treatment.", date: "02 Jan 2026" },
    { id: 2, farmer: "Farmer Anita", animal: "Goat #B07", rating: 4, comment: "Helpful advice on hoof care.", date: "03 Jan 2026" },
    { id: 3, farmer: "Farmer Kumar", animal: "Sheep #C21", rating: 3, comment: "Respiratory infection follow-up was satisfactory.", date: "04 Jan 2026" },
    { id: 4, farmer: "Farmer Meena", animal: "Cow #A15", rating: 5, comment: "Digestive disorder consultation was very clear.", date: "05 Jan 2026" },
    { id: 5, farmer: "Farmer Joseph", animal: "Goat #B11", rating: 4, comment: "Skin dermatitis treatment worked well.", date: "06 Jan 2026" },
    { id: 6, farmer: "Farmer Patel", animal: "Sheep #C09", rating: 5, comment: "Nutritional deficiency plan was excellent.", date: "07 Jan 2026" },
    { id: 7, farmer: "Farmer Gupta", animal: "Cow #A18", rating: 4, comment: "Vaccination schedule was well explained.", date: "08 Jan 2026" },
    { id: 8, farmer: "Farmer Rao", animal: "Goat #B14", rating: 3, comment: "Parasite infection follow-up could be more detailed.", date: "09 Jan 2026" },
    { id: 9, farmer: "Farmer Sharma", animal: "Sheep #C25", rating: 5, comment: "Joint pain management advice was very effective.", date: "10 Jan 2026" },
    { id: 10, farmer: "Farmer Kumar", animal: "Cow #A20", rating: 4, comment: "Rabies vaccine consultation was reassuring.", date: "11 Jan 2026" }
  ]

  const [filter, setFilter] = useState("all")

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === "all") return true
    if (filter === "positive") return f.rating >= 4
    if (filter === "critical") return f.rating <= 3
    return true
  })

  return (
    <DashboardSection title="Farmer Feedback">
      <p className="mb-3">View and manage feedback submitted after consultations:</p>

      <div className="mb-3 d-flex gap-2">
        <button
          className={`btn btn-sm ${filter === "all" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === "positive" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("positive")}
        >
          Positive (⭐ 4–5)
        </button>
        <button
          className={`btn btn-sm ${filter === "critical" ? "btn-brown" : "btn-outline-brown"}`}
          onClick={() => setFilter("critical")}
        >
          Critical (⭐ 1–3)
        </button>
      </div>

      <ul className="list-group">
        {filteredFeedbacks.map(f => (
          <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{f.farmer} • {f.animal} • {f.comment}</span>
            <small className="text-muted">⭐ {f.rating} • {f.date}</small>
          </li>
        ))}
        {filteredFeedbacks.length === 0 && (
          <li className="list-group-item text-muted">No feedback found.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
