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

export default function SurgicalCases() {
  const cases = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", surgery: "Mastitis abscess drainage", status: "Recovering", date: "02 Feb 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", surgery: "Hoof corrective surgery", status: "Completed", date: "01 Feb 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", surgery: "Crop impaction removal", status: "Recovering", date: "31 Jan 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", surgery: "Caesarean section", status: "Critical", date: "30 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", surgery: "Dermatitis lesion excision", status: "Recovering", date: "29 Jan 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", surgery: "Fracture fixation", status: "Completed", date: "28 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", surgery: "Brucellosis lymph node biopsy", status: "Recovering", date: "27 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", surgery: "Intestinal obstruction surgery", status: "Critical", date: "26 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", surgery: "Joint debridement", status: "Recovering", date: "25 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", surgery: "Rabies wound suturing", status: "Completed", date: "24 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredCases = cases.filter(c =>
    filter === "All" ? true : c.status === filter
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "Recovering": return "badge bg-info text-dark"
      case "Critical": return "badge bg-danger"
      case "Completed": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  // Pie chart: distribution by status
  const pieData = {
    labels: ["Recovering", "Critical", "Completed"],
    datasets: [
      {
        data: [
          cases.filter(c => c.status === "Recovering").length,
          cases.filter(c => c.status === "Critical").length,
          cases.filter(c => c.status === "Completed").length
        ],
        backgroundColor: ["#17a2b8", "#dc3545", "#28a745"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: weekly surgical trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Surgeries Performed",
        data: [2, 4, 3, 1],
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
    <DashboardSection title="Surgical Cases">
      <p className="mb-3">Veterinary surgical cases across Zimbabwean farms:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Recovering", "Critical", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Surgical cases list */}
      <ul className="list-group mb-3">
        {filteredCases.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{c.farmer} • {c.animal} • {c.surgery}</span>
            <div>
              <span className={getStatusClass(c.status)}>{c.status}</span>
              <small className="text-muted ms-2">{c.date}</small>
            </div>
          </li>
        ))}
        {filteredCases.length === 0 && (
          <li className="list-group-item text-muted">No surgical cases found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Surgical Case Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Surgical Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
