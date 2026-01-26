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

export default function FollowUps() {
  const [filter, setFilter] = useState("All")

  const followUps = [
    { id: 1, animal: "Cow #A12", species: "Cattle", reason: "Post-mastitis check", date: "02 Feb 2026", status: "Scheduled" },
    { id: 2, animal: "Goat #B07", species: "Goat", reason: "Foot rot recovery", date: "03 Feb 2026", status: "Scheduled" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", reason: "Respiratory infection follow-up", date: "04 Feb 2026", status: "Completed" },
    { id: 4, animal: "Cow #A15", species: "Cattle", reason: "Digestive disorder monitoring", date: "05 Feb 2026", status: "Scheduled" },
    { id: 5, animal: "Goat #B11", species: "Goat", reason: "Skin dermatitis treatment", date: "06 Feb 2026", status: "Scheduled" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", reason: "Nutritional deficiency check", date: "07 Feb 2026", status: "Completed" },
    { id: 7, animal: "Cow #A18", species: "Cattle", reason: "Brucellosis vaccination review", date: "08 Feb 2026", status: "Scheduled" },
    { id: 8, animal: "Goat #B14", species: "Goat", reason: "Parasite infection follow-up", date: "09 Feb 2026", status: "Scheduled" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", reason: "Joint pain management", date: "10 Feb 2026", status: "Scheduled" },
    { id: 10, animal: "Cow #A20", species: "Cattle", reason: "Rabies vaccine series check", date: "11 Feb 2026", status: "Scheduled" }
  ]

  const filteredFollowUps = followUps.filter(f =>
    filter === "All" ? true : f.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Scheduled") return "text-warning fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  // Pie chart: status distribution
  const statuses = ["Scheduled", "Completed"]
  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statuses.map(s => followUps.filter(f => f.status === s).length),
        backgroundColor: ["#FFA500", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: follow-ups over time
  const lineData = {
    labels: followUps.map(f => f.date),
    datasets: [
      {
        label: "Follow-ups Logged",
        data: followUps.map(() => 1),
        borderColor: "#8B4513",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Species breakdown chart (stacked bar)
  const species = [...new Set(followUps.map(f => f.species))]
  const barData = {
    labels: species,
    datasets: [
      {
        label: "Scheduled",
        data: species.map(sp => followUps.filter(f => f.species === sp && f.status === "Scheduled").length),
        backgroundColor: "#FFA500"
      },
      {
        label: "Completed",
        data: species.map(sp => followUps.filter(f => f.species === sp && f.status === "Completed").length),
        backgroundColor: "#228B22"
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

  const scheduledCount = followUps.filter(f => f.status === "Scheduled").length

  return (
    <DashboardSection title="Follow Ups (Zimbabwe)">
      <p>Track and manage scheduled follow-up visits for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {scheduledCount > 5 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {scheduledCount} follow-ups are scheduled. Monitor workload and plan accordingly!
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

      {/* Follow-ups list */}
      <ul className="list-group">
        {filteredFollowUps.map(f => (
          <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{f.animal} • {f.reason}</span>
            <small className={getStatusClass(f.status)}>{f.date} — {f.status}</small>
          </li>
        ))}
        {filteredFollowUps.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} follow-ups found.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Status Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Follow-up Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Follow-ups Over Time" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Species Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Follow-ups by Species" }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
      </div>
    </DashboardSection>
  )
}
