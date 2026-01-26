import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function FeedPlans() {
  const [filter, setFilter] = useState("All")

  const plans = [
    { id: 1, animal: "Cow #A12", species: "Cattle", plan: "High protein feed • Twice daily" },
    { id: 2, animal: "Goat #B07", species: "Goat", plan: "Vitamin-rich feed • Morning only" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", plan: "Balanced diet • Evening only" },
    { id: 4, animal: "Cow #A15", species: "Cattle", plan: "Mineral supplements • Once daily" },
    { id: 5, animal: "Goat #B11", species: "Goat", plan: "High fiber feed • Twice daily" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", plan: "Omega-3 enriched feed • Morning" },
    { id: 7, animal: "Cow #A18", species: "Cattle", plan: "Carbohydrate-balanced feed • Twice daily" },
    { id: 8, animal: "Goat #B14", species: "Goat", plan: "Vitamin B complex feed • Evening" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", plan: "Mineral-rich feed • Morning + Evening" },
    { id: 10, animal: "Cow #A20", species: "Cattle", plan: "Probiotic supplements • Once daily" }
  ]

  const filteredPlans = plans.filter(p =>
    filter === "All" ? true : p.species === filter
  )

  // Conditional styling
  const getPlanClass = (plan) => {
    if (plan.includes("protein") || plan.includes("fiber")) return "text-danger fw-bold"
    if (plan.includes("Vitamin") || plan.includes("Omega") || plan.includes("Probiotic")) return "text-success fw-bold"
    if (plan.includes("Mineral")) return "text-warning fw-bold"
    return ""
  }

  // Pie chart: species distribution
  const species = [...new Set(plans.map(p => p.species))]
  const pieData = {
    labels: species,
    datasets: [
      {
        data: species.map(s => plans.filter(p => p.species === s).length),
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: feed type breakdown
  const feedTypes = ["Protein", "Vitamin", "Mineral", "Fiber", "Carbohydrate", "Probiotic", "Balanced"]
  const barData = {
    labels: feedTypes,
    datasets: [
      {
        label: "Count",
        data: feedTypes.map(type => plans.filter(p => p.plan.toLowerCase().includes(type.toLowerCase())).length),
        backgroundColor: "#A0522D"
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

  // Conditional alert: if protein/fiber plans dominate
  const proteinFiberCount = plans.filter(p => p.plan.toLowerCase().includes("protein") || p.plan.toLowerCase().includes("fiber")).length
  const dominanceAlert = proteinFiberCount / plans.length > 0.4

  return (
    <DashboardSection title="Feed Plans (Zimbabwe)">
      <p>Scheduled feeding plans for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {dominanceAlert && (
        <div className="alert alert-warning fw-bold">
          ⚠️ Protein/Fiber-heavy diets make up over 40% of plans. Review balance across herd!
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

      {/* Plans list */}
      <ul className="list-group">
        {filteredPlans.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{p.animal} • <span className={getPlanClass(p.plan)}>{p.plan}</span></span>
          </li>
        ))}
        {filteredPlans.length === 0 && (
          <li className="list-group-item text-muted">No feed plans found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Species Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Feed Type Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Feed Types Across Herd" } }} />
      </div>
    </DashboardSection>
  )
}
