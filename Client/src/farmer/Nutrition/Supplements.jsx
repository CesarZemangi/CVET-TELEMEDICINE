import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function Supplements() {
  const [filter, setFilter] = useState("All")

  const supplements = [
    { id: 1, animal: "Cow #A12", species: "Cattle", supplement: "Mineral Mix", schedule: "Daily feed", date: "10 Jan 2026" },
    { id: 2, animal: "Goat #B07", species: "Goat", supplement: "Vitamin D", schedule: "Weekly dose", date: "12 Jan 2026" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", supplement: "Calcium", schedule: "Daily feed", date: "14 Jan 2026" },
    { id: 4, animal: "Cow #A15", species: "Cattle", supplement: "Iron Supplement", schedule: "Twice weekly", date: "16 Jan 2026" },
    { id: 5, animal: "Goat #B11", species: "Goat", supplement: "Omega-3", schedule: "Daily feed", date: "18 Jan 2026" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", supplement: "Vitamin B Complex", schedule: "Weekly dose", date: "20 Jan 2026" },
    { id: 7, animal: "Cow #A18", species: "Cattle", supplement: "Probiotic", schedule: "Daily feed", date: "22 Jan 2026" },
    { id: 8, animal: "Goat #B14", species: "Goat", supplement: "Vitamin C", schedule: "Twice weekly", date: "24 Jan 2026" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", supplement: "Mineral Block", schedule: "Daily feed", date: "26 Jan 2026" },
    { id: 10, animal: "Cow #A20", species: "Cattle", supplement: "Vitamin Booster", schedule: "Weekly dose", date: "28 Jan 2026" }
  ]

  const filteredSupplements = supplements.filter(s =>
    filter === "All" ? true : s.species === filter
  )

  const getScheduleClass = (schedule) => {
    if (schedule.includes("Daily")) return "text-success fw-bold"
    if (schedule.includes("Weekly")) return "text-warning fw-bold"
    if (schedule.includes("Twice")) return "text-primary fw-bold"
    return ""
  }

  // Pie chart: schedule distribution
  const schedules = ["Daily feed", "Weekly dose", "Twice weekly"]
  const pieData = {
    labels: schedules,
    datasets: [
      {
        data: schedules.map(s => supplements.filter(sup => sup.schedule.includes(s.split(" ")[0])).length),
        backgroundColor: ["#228B22", "#FFA500", "#1E90FF"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: supplement type breakdown
  const types = [...new Set(supplements.map(s => s.supplement))]
  const barData = {
    labels: types,
    datasets: [
      {
        label: "Count",
        data: types.map(t => supplements.filter(s => s.supplement === t).length),
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Timeline chart: supplement schedules over time
  const lineData = {
    labels: supplements.map(s => s.date),
    datasets: [
      {
        label: "Supplements Logged",
        data: supplements.map(() => 1),
        borderColor: "#8B4513",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  }

  const weeklyCount = supplements.filter(s => s.schedule.includes("Weekly")).length
  const twiceCount = supplements.filter(s => s.schedule.includes("Twice")).length

  return (
    <DashboardSection title="Supplements (Zimbabwe)">
      <p>Current supplement schedules for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {(weeklyCount + twiceCount) > 4 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {weeklyCount} weekly and {twiceCount} twice-weekly supplements. Monitor herd compliance closely!
        </div>
      )}

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

      {/* Supplements list */}
      <ul className="list-group">
        {filteredSupplements.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.animal} • {s.supplement}</span>
            <small className={getScheduleClass(s.schedule)}>{s.schedule} • {s.date}</small>
          </li>
        ))}
        {filteredSupplements.length === 0 && (
          <li className="list-group-item text-muted">No supplements found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Schedule Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Supplement Type Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Supplements Across Herd" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Supplement Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Supplement Plans Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
