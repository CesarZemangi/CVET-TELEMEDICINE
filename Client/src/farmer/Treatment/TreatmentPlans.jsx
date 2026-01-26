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

export default function TreatmentPlans() {
  const [filter, setFilter] = useState("All")

  const plans = [
    { id: 1, animal: "Cow #A12", species: "Cattle", condition: "Mastitis", plan: "Antibiotic course, 7 days", status: "Ongoing", date: "02 Jan 2026" },
    { id: 2, animal: "Goat #B07", species: "Goat", condition: "Foot Rot", plan: "Topical ointment, 10 days", status: "Completed", date: "04 Jan 2026" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", condition: "Respiratory Infection", plan: "Respiratory medicine, 5 days", status: "Ongoing", date: "06 Jan 2026" },
    { id: 4, animal: "Cow #A15", species: "Cattle", condition: "Digestive Disorder", plan: "Diet adjustment + probiotics", status: "Completed", date: "08 Jan 2026" },
    { id: 5, animal: "Goat #B11", species: "Goat", condition: "Skin Dermatitis", plan: "Skin ointment, 14 days", status: "Ongoing", date: "10 Jan 2026" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", condition: "Nutritional Deficiency", plan: "Vitamin supplements, 30 days", status: "Ongoing", date: "12 Jan 2026" },
    { id: 7, animal: "Cow #A18", species: "Cattle", condition: "Brucellosis", plan: "Vaccination + monitoring", status: "Completed", date: "14 Jan 2026" },
    { id: 8, animal: "Goat #B14", species: "Goat", condition: "Parasite Infection", plan: "Dewormer, single dose", status: "Completed", date: "16 Jan 2026" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", condition: "Joint Pain", plan: "Painkiller, 7 days", status: "Ongoing", date: "18 Jan 2026" },
    { id: 10, animal: "Cow #A20", species: "Cattle", condition: "Rabies Exposure", plan: "Rabies vaccine series", status: "Ongoing", date: "20 Jan 2026" }
  ]

  const filteredPlans = plans.filter(p =>
    filter === "All" ? true : p.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Ongoing") return "text-warning fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  // Pie chart: status distribution
  const statuses = ["Ongoing", "Completed"]
  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statuses.map(s => plans.filter(p => p.status === s).length),
        backgroundColor: ["#FFA500", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: condition breakdown
  const conditions = [...new Set(plans.map(p => p.condition))]
  const barData = {
    labels: conditions,
    datasets: [
      {
        label: "Count",
        data: conditions.map(c => plans.filter(p => p.condition === c).length),
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Timeline chart: treatments over time
  const lineData = {
    labels: plans.map(p => p.date),
    datasets: [
      {
        label: "Treatment Plans Logged",
        data: plans.map(() => 1),
        borderColor: "#8B4513",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Species breakdown chart (stacked bar)
  const species = [...new Set(plans.map(p => p.species))]
  const speciesBarData = {
    labels: species,
    datasets: [
      {
        label: "Ongoing",
        data: species.map(sp => plans.filter(p => p.species === sp && p.status === "Ongoing").length),
        backgroundColor: "#FFA500"
      },
      {
        label: "Completed",
        data: species.map(sp => plans.filter(p => p.species === sp && p.status === "Completed").length),
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

  const ongoingCount = plans.filter(p => p.status === "Ongoing").length

  return (
    <DashboardSection title="Treatment Plans (Zimbabwe)">
      <p>View and follow prescribed treatment plans for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {ongoingCount > 5 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {ongoingCount} treatments are still ongoing. Monitor herd health closely!
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

      {/* Plans list */}
      <ul className="list-group">
        {filteredPlans.map(plan => (
          <li key={plan.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{plan.animal} • {plan.condition} • {plan.plan}</span>
            <small className={getStatusClass(plan.status)}>{plan.date} — {plan.status}</small>
          </li>
        ))}
        {filteredPlans.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} plans found.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Status Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Condition Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Treatment Plans by Condition" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Treatment Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Treatment Plans Over Time" } }} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Species Breakdown</h6>
        <Bar data={speciesBarData} options={{ ...options, title: { text: "Treatment Plans by Species" } }} />
      </div>
    </DashboardSection>
  )
}
