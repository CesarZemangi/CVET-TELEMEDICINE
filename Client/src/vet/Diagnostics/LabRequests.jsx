import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function LabRequests() {
  const requests = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", test: "Milk culture (Mastitis)", status: "Pending", date: "02 Jan 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", test: "Fecal exam (Parasites)", status: "Pending", date: "03 Jan 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", test: "PCR (Newcastle disease)", status: "In Progress", date: "04 Jan 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", test: "Blood test (FMD antibodies)", status: "Completed", date: "05 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", test: "Skin scraping (Dermatitis)", status: "Pending", date: "06 Jan 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", test: "Blood chemistry (Nutrition)", status: "In Progress", date: "07 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", test: "Serology (Brucellosis)", status: "Pending", date: "08 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", test: "Fecal culture (Coccidiosis)", status: "Completed", date: "09 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", test: "Joint fluid analysis", status: "Pending", date: "10 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", test: "Rabies antigen test", status: "In Progress", date: "11 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredRequests = requests.filter(req =>
    filter === "All" ? true : req.status === filter
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "text-danger"
      case "In Progress": return "text-warning"
      case "Completed": return "text-success"
      default: return "text-muted"
    }
  }

  return (
    <DashboardSection title="Lab Test Requests">
      <p className="mb-3">Pending and completed lab test requests from Zimbabwean farmers:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Pending", "In Progress", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <ul className="list-group">
        {filteredRequests.map(req => (
          <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{req.farmer} • {req.animal} • {req.test}</span>
            <small className={getStatusClass(req.status)}>
              {req.date} — {req.status}
            </small>
          </li>
        ))}
        {filteredRequests.length === 0 && (
          <li className="list-group-item text-muted">No requests found for {filter}.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
