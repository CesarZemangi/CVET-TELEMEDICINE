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

export default function TreatmentPlans() {
  const [filter, setFilter] = useState("All")

  const plans = [
    { id: 1, animal: "Cow #A12", condition: "Mastitis", plan: "Antibiotic course, 7 days", status: "Ongoing" },
    { id: 2, animal: "Goat #B07", condition: "Foot Rot", plan: "Topical ointment, 10 days", status: "Completed" },
    { id: 3, animal: "Sheep #C21", condition: "Respiratory Infection", plan: "Respiratory medicine, 5 days", status: "Ongoing" },
    { id: 4, animal: "Cow #A15", condition: "Digestive Disorder", plan: "Diet adjustment + probiotics", status: "Completed" },
    { id: 5, animal: "Goat #B11", condition: "Skin Dermatitis", plan: "Skin ointment, 14 days", status: "Ongoing" },
    { id: 6, animal: "Sheep #C09", condition: "Nutritional Deficiency", plan: "Vitamin supplements, 30 days", status: "Ongoing" },
    { id: 7, animal: "Cow #A18", condition: "Brucellosis", plan: "Vaccination + monitoring", status: "Completed" },
    { id: 8, animal: "Goat #B14", condition: "Parasite Infection", plan: "Dewormer, single dose", status: "Completed" },
    { id: 9, animal: "Sheep #C25", condition: "Joint Pain", plan: "Painkiller, 7 days", status: "Ongoing" },
    { id: 10, animal: "Cow #A20", condition: "Rabies Exposure", plan: "Rabies vaccine series", status: "Ongoing" }
  ]

  const filteredPlans = plans.filter(p =>
    filter === "All" ? true : p.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Ongoing") return "text-warning fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  // Summary chart
  const pieData = {
    labels: ["Ongoing", "Completed"],
    datasets: [
      {
        data: [
          plans.filter(p => p.status === "Ongoing").length,
          plans.filter(p => p.status === "Completed").length
        ],
        backgroundColor: ["#FFA500", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Condition breakdown chart
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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  }

  const ongoingCount = plans.filter(p => p.status === "Ongoing").length

  return (
    <DashboardSection title="Treatment Plans (Zimbabwe)">
      <p>Current and past treatment plans for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {ongoingCount > 5 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {ongoingCount} treatment plans are still ongoing. Monitor workload closely!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Ongoing", "Completed"].map(f => (
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
            <small className={getStatusClass(plan.status)}>{plan.status}</small>
          </li>
        ))}
        {filteredPlans.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} plans found.</li>
        )}
      </ul>

      {/* Summary chart */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Status Summary</h6>
        <Pie data={pieData} options={options} />
      </div>

      {/* Condition breakdown chart */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Condition Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Conditions Treated" } }} />
      </div>
    </DashboardSection>
  )
}
