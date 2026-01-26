import React, { useState } from "react"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function TreatmentPlans() {
  const plans = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", species: "Cattle", plan: "Mastitis antibiotic + supportive care", status: "Active", date: "02 Feb 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", species: "Goat", plan: "Hoof trimming + antifungal spray", status: "Completed", date: "01 Feb 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", species: "Poultry", plan: "Newcastle vaccination booster schedule", status: "Active", date: "31 Jan 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", species: "Cattle", plan: "Fertility hormone therapy plan", status: "Critical", date: "30 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", species: "Goat", plan: "Dermatitis ointment + dietary adjustment", status: "Active", date: "29 Jan 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", species: "Sheep", plan: "Mineral supplement + fracture rehab", status: "Completed", date: "28 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", species: "Cattle", plan: "Brucellosis vaccination + monitoring", status: "Active", date: "27 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", species: "Goat", plan: "Coccidiosis oral medication + hydration", status: "Critical", date: "26 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", species: "Sheep", plan: "Joint inflammation therapy + physiotherapy", status: "Active", date: "25 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", species: "Cattle", plan: "Rabies vaccination booster", status: "Completed", date: "24 Jan 2026" }
  ]

  const [statusFilter, setStatusFilter] = useState("All")
  const [speciesFilter, setSpeciesFilter] = useState("All")

  const filteredPlans = plans.filter(p =>
    (statusFilter === "All" ? true : p.status === statusFilter) &&
    (speciesFilter === "All" ? true : p.species === speciesFilter)
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "badge bg-info text-dark"
      case "Critical": return "badge bg-danger"
      case "Completed": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  // Pie chart: distribution by status
  const pieData = {
    labels: ["Active", "Critical", "Completed"],
    datasets: [
      {
        data: [
          plans.filter(p => p.status === "Active").length,
          plans.filter(p => p.status === "Critical").length,
          plans.filter(p => p.status === "Completed").length
        ],
        backgroundColor: ["#17a2b8", "#dc3545", "#28a745"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: weekly treatment plan trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Treatment Plans Initiated",
        data: [2, 3, 4, 1],
        borderColor: "#2E8B57",
        backgroundColor: "#98FB98",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  }

  return (
    <DashboardSection title="Treatment Plans">
      <p className="mb-3">Structured treatment plans across Zimbabwean farms:</p>

      {/* Status filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Active", "Critical", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Species filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Cattle", "Goat", "Poultry", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${speciesFilter === species ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setSpeciesFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      {/* Treatment plans list */}
      <ul className="list-group mb-3">
        {filteredPlans.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{p.farmer} • {p.animal} • {p.plan}</span>
            <div>
              <span className={getStatusClass(p.status)}>{p.status}</span>
              <small className="text-muted ms-2">{p.date}</small>
            </div>
          </li>
        ))}
        {filteredPlans.length === 0 && (
          <li className="list-group-item text-muted">No treatment plans found for {statusFilter} in {speciesFilter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Treatment Plan Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Treatment Plan Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
