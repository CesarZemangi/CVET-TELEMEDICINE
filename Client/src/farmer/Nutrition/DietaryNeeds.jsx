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

export default function DietaryNeeds() {
  const [filter, setFilter] = useState("All")

  const needs = [
    { id: 1, animal: "Cow #A12", species: "Cattle", recommendation: "Calcium-rich diet", date: "10 Jan 2026" },
    { id: 2, animal: "Goat #B07", species: "Goat", recommendation: "High-protein feed", date: "12 Jan 2026" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", recommendation: "Vitamin D supplements", date: "14 Jan 2026" },
    { id: 4, animal: "Cow #A15", species: "Cattle", recommendation: "Low-fiber diet", date: "16 Jan 2026" },
    { id: 5, animal: "Goat #B11", species: "Goat", recommendation: "Iron-rich feed", date: "18 Jan 2026" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", recommendation: "Omega-3 supplements", date: "20 Jan 2026" },
    { id: 7, animal: "Cow #A18", species: "Cattle", recommendation: "Balanced carbohydrate intake", date: "22 Jan 2026" },
    { id: 8, animal: "Goat #B14", species: "Goat", recommendation: "Vitamin B complex", date: "24 Jan 2026" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", recommendation: "Mineral-rich diet", date: "26 Jan 2026" },
    { id: 10, animal: "Cow #A20", species: "Cattle", recommendation: "Probiotic supplements", date: "28 Jan 2026" }
  ]

  const filteredNeeds = needs.filter(n =>
    filter === "All" ? true : n.species === filter
  )

  const getRecommendationClass = (rec) => {
    if (rec.includes("Calcium") || rec.includes("Iron")) return "text-danger fw-bold"
    if (rec.includes("Vitamin") || rec.includes("Omega") || rec.includes("Probiotic")) return "text-success fw-bold"
    if (rec.includes("Low-fiber")) return "text-warning fw-bold"
    return ""
  }

  // Pie chart: species distribution
  const species = [...new Set(needs.map(n => n.species))]
  const pieData = {
    labels: species,
    datasets: [
      {
        data: species.map(s => needs.filter(n => n.species === s).length),
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: recommendation breakdown
  const recs = [...new Set(needs.map(n => n.recommendation))]
  const barData = {
    labels: recs,
    datasets: [
      {
        label: "Count",
        data: recs.map(r => needs.filter(n => n.recommendation === r).length),
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Timeline chart: dietary needs over time
  const lineData = {
    labels: needs.map(n => n.date),
    datasets: [
      {
        label: "Dietary Plans",
        data: needs.map(() => 1),
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
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

  const supplementCount = needs.filter(n =>
    n.recommendation.includes("Vitamin") || n.recommendation.includes("Omega") || n.recommendation.includes("Probiotic")
  ).length

  return (
    <DashboardSection title="Dietary Needs (Zimbabwe)">
      <p>Recommended dietary plans for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {supplementCount > 3 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {supplementCount} animals require supplements. Review herd nutrition strategy!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...species].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Needs list */}
      <ul className="list-group">
        {filteredNeeds.map(need => (
          <li key={need.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{need.animal} • <span className={getRecommendationClass(need.recommendation)}>{need.recommendation}</span></span>
            <small className="text-muted">{need.date}</small>
          </li>
        ))}
        {filteredNeeds.length === 0 && (
          <li className="list-group-item text-muted">No dietary needs found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Species Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Recommendation Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Dietary Recommendations" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Dietary Needs Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Dietary Plans Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
