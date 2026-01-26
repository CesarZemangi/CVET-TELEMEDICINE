import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function ReportsExport() {
  const [regionFilter, setRegionFilter] = useState("All")
  const [speciesFilter, setSpeciesFilter] = useState("All")

  const reports = [
    "Monthly Health Trends",
    "Treatment Effectiveness",
    "Consultation Statistics",
    "Livestock Performance",
    "Nutrition Reports",
    "Medication History",
    "Vaccination Coverage",
    "Farmer Compliance Summary",
    "Disease Tracking",
    "Regional Mortality & Recovery Statistics"
  ]

  return (
    <DashboardSection title="Reports Export (Zimbabwe)">
      <p>Select a format to export your farm and veterinary reports:</p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-outline-brown">Export PDF</button>
        <button className="btn btn-outline-brown">Export Excel</button>
        <button className="btn btn-outline-brown">Export CSV</button>
        <button className="btn btn-outline-brown">Export Word</button>
        <button className="btn btn-outline-brown">Export PowerPoint</button>
        <button className="btn btn-outline-brown">Export JSON</button>
        <button className="btn btn-outline-brown">Export XML</button>
        <button className="btn btn-outline-brown">Export HTML</button>
      </div>

      {/* Region filter */}
      <h6 className="fw-semibold mt-3">Filter by Region:</h6>
      <div className="d-flex gap-2 mb-3">
        {["All", "Mashonaland", "Matabeleland", "Midlands", "Manicaland"].map(region => (
          <button
            key={region}
            className={`btn btn-sm ${regionFilter === region ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setRegionFilter(region)}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Species filter */}
      <h6 className="fw-semibold mt-3">Filter by Species:</h6>
      <div className="d-flex gap-2 mb-3">
        {["All", "Cattle", "Goats", "Poultry", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${speciesFilter === species ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setSpeciesFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      <h6 className="fw-semibold mt-3">Available Reports:</h6>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            {report} ({regionFilter}, {speciesFilter})
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
