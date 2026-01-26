import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function SurgicalCases() {
  const [filter, setFilter] = useState("All")

  const cases = [
    { id: 1, animal: "Cow #A12", species: "Cattle", surgery: "Mastitis Surgery", date: "05 Jan 2026", status: "Recovering" },
    { id: 2, animal: "Goat #B07", species: "Goat", surgery: "Hoof Repair", date: "07 Jan 2026", status: "Completed" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", surgery: "Respiratory Tract Surgery", date: "09 Jan 2026", status: "Recovering" },
    { id: 4, animal: "Cow #A15", species: "Cattle", surgery: "Digestive Tract Surgery", date: "11 Jan 2026", status: "Completed" },
    { id: 5, animal: "Goat #B11", species: "Goat", surgery: "Skin Tumor Removal", date: "13 Jan 2026", status: "Recovering" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", surgery: "Joint Surgery", date: "15 Jan 2026", status: "Completed" },
    { id: 7, animal: "Cow #A18", species: "Cattle", surgery: "Brucellosis-related Surgery", date: "17 Jan 2026", status: "Recovering" },
    { id: 8, animal: "Goat #B14", species: "Goat", surgery: "Parasite Removal Surgery", date: "19 Jan 2026", status: "Completed" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", surgery: "Orthopedic Surgery", date: "21 Jan 2026", status: "Recovering" },
    { id: 10, animal: "Cow #A20", species: "Cattle", surgery: "Rabies Exposure Treatment Surgery", date: "23 Jan 2026", status: "Scheduled" }
  ]

  const filteredCases = cases.filter(c =>
    filter === "All" ? true : c.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Scheduled") return "text-primary fw-bold"
    if (status === "Recovering") return "text-warning fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  // Pie chart: status distribution
  const statuses = ["Scheduled", "Recovering", "Completed"]
  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statuses.map(s => cases.filter(c => c.status === s).length),
        backgroundColor: ["#1E90FF", "#FFA500", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: surgeries over time
  const lineData = {
    labels: cases.map(c => c.date),
    datasets: [
      {
        label: "Surgical Cases Logged",
        data: cases.map(() => 1),
        borderColor: "#8B4513",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Species breakdown chart (stacked bar)
  const species = [...new Set(cases.map(c => c.species))]
  const barData = {
    labels: species,
    datasets: [
      {
        label: "Scheduled",
        data: species.map(sp => cases.filter(c => c.species === sp && c.status === "Scheduled").length),
        backgroundColor: "#1E90FF"
      },
      {
        label: "Recovering",
        data: species.map(sp => cases.filter(c => c.species === sp && c.status === "Recovering").length),
        backgroundColor: "#FFA500"
      },
      {
        label: "Completed",
        data: species.map(sp => cases.filter(c => c.species === sp && c.status === "Completed").length),
        backgroundColor: "#228B22"
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  }

  const recoveringCount = cases.filter(c => c.status === "Recovering").length

  return (
    <DashboardSection title="Surgical Cases (Zimbabwe)">
      <p>Manage surgery-related records and recovery details for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {recoveringCount > 4 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {recoveringCount} surgeries are still in recovery. Monitor herd health closely!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...statuses].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cases list */}
      <ul className="list-group">
        {filteredCases.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{c.animal} • {c.surgery}</span>
            <small className={getStatusClass(c.status)}>{c.date} — {c.status}</small>
          </li>
        ))}
        {filteredCases.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} cases found.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Status Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Surgical Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Surgeries Over Time" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Species Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Surgical Cases by Species" } }} />
      </div>
    </DashboardSection>
  )
}
