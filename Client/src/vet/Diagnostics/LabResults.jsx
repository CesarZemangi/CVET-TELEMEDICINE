import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function LabResults() {
  const results = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", test: "Blood panel", finding: "Normal", severity: "Normal", date: "02 Jan 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", test: "Fecal exam", finding: "High parasite load", severity: "Critical", date: "03 Jan 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", test: "PCR (Newcastle)", finding: "Negative", severity: "Normal", date: "04 Jan 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", test: "Blood test (FMD antibodies)", finding: "Positive", severity: "Critical", date: "05 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", test: "Skin scraping", finding: "Dermatitis confirmed", severity: "Minor", date: "06 Jan 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", test: "Blood chemistry", finding: "Low calcium", severity: "Minor", date: "07 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", test: "Serology (Brucellosis)", finding: "Negative", severity: "Normal", date: "08 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", test: "Fecal culture", finding: "Coccidiosis detected", severity: "Critical", date: "09 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", test: "Joint fluid analysis", finding: "Mild inflammation", severity: "Minor", date: "10 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", test: "Rabies antigen", finding: "Negative", severity: "Normal", date: "11 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredResults = results.filter(r =>
    filter === "All" ? true : r.severity === filter
  )

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical": return "badge bg-danger"
      case "Minor": return "badge bg-warning text-dark"
      case "Normal": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  return (
    <DashboardSection title="Lab Results">
      <p className="mb-3">Laboratory results from Zimbabwean farmers:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Normal", "Minor", "Critical"].map(severity => (
          <button
            key={severity}
            className={`btn btn-sm ${filter === severity ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(severity)}
          >
            {severity}
          </button>
        ))}
      </div>

      {/* Results list */}
      <ul className="list-group">
        {filteredResults.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{r.farmer} • {r.animal} • {r.test} • {r.finding}</span>
            <div>
              <span className={getSeverityClass(r.severity)}>{r.severity}</span>
              <small className="text-muted ms-2">{r.date}</small>
            </div>
          </li>
        ))}
        {filteredResults.length === 0 && (
          <li className="list-group-item text-muted">No results found for {filter}.</li>
        )}
      </ul>
    </DashboardSection>
  )
}
