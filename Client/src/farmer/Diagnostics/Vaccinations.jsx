import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function Vaccinations() {
  const [filter, setFilter] = useState("All")

  const records = [
    { id: 1, animal: "Cow #A12", species: "Cattle", vaccine: "FMD Vaccine", date: "10 Jan 2026" },
    { id: 2, animal: "Goat #B07", species: "Goat", vaccine: "Rabies Vaccine", date: "12 Jan 2026" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", vaccine: "PPR Vaccine", date: "14 Jan 2026" },
    { id: 4, animal: "Cow #A15", species: "Cattle", vaccine: "Brucellosis Vaccine", date: "16 Jan 2026" },
    { id: 5, animal: "Goat #B11", species: "Goat", vaccine: "Tetanus Vaccine", date: "18 Jan 2026" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", vaccine: "Anthrax Vaccine", date: "20 Jan 2026" },
    { id: 7, animal: "Cow #A18", species: "Cattle", vaccine: "Black Quarter Vaccine", date: "22 Jan 2026" },
    { id: 8, animal: "Goat #B14", species: "Goat", vaccine: "Enterotoxemia Vaccine", date: "24 Jan 2026" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", vaccine: "Sheep Pox Vaccine", date: "26 Jan 2026" },
    { id: 10, animal: "Cow #A20", species: "Cattle", vaccine: "Rabies Booster", date: "28 Jan 2026" }
  ]

  const filteredRecords = records.filter(r =>
    filter === "All" ? true : r.species === filter
  )

  // Pie chart: distribution of vaccines by species
  const pieData = {
    labels: ["Cattle", "Goat", "Sheep"],
    datasets: [
      {
        data: [
          records.filter(r => r.species === "Cattle").length,
          records.filter(r => r.species === "Goat").length,
          records.filter(r => r.species === "Sheep").length
        ],
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: vaccinations over time
  const lineData = {
    labels: records.map(r => r.date),
    datasets: [
      {
        label: "Vaccinations",
        data: records.map(() => 1),
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Bar chart: vaccine type breakdown
  const vaccineTypes = [...new Set(records.map(r => r.vaccine))]
  const barData = {
    labels: vaccineTypes,
    datasets: [
      {
        label: "Count",
        data: vaccineTypes.map(v => records.filter(r => r.vaccine === v).length),
        backgroundColor: "#A0522D"
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true }
    }
  }

  return (
    <DashboardSection title="Vaccination Records (Zimbabwe)">
      <p>Vaccination records for cattle, goats, and sheep.</p>

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Cattle", "Goat", "Sheep"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Records list */}
      <ul className="list-group">
        {filteredRecords.map(record => (
          <li key={record.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{record.animal} • {record.vaccine}</span>
            <small className="text-muted">{record.date}</small>
          </li>
        ))}
        {filteredRecords.length === 0 && (
          <li className="list-group-item text-muted">No records found for {filter}.</li>
        )}
      </ul>

      {/* Summary chart */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Species Distribution</h6>
        <Pie data={pieData} options={{ ...options, title: { text: "Vaccinations by Species" } }} />
      </div>

      {/* Timeline chart */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Vaccination Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Vaccinations Over Time" } }} />
      </div>

      {/* Vaccine type breakdown */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Vaccine Type Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Vaccinations by Type" } }} />
      </div>
    </DashboardSection>
  )
}
