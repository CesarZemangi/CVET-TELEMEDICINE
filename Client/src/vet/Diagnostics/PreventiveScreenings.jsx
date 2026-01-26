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

export default function PreventiveScreenings() {
  const screenings = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", type: "Foot-and-Mouth vaccination", status: "Scheduled", date: "02 Feb 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", type: "Deworming", status: "Completed", date: "28 Jan 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", type: "Newcastle disease screening", status: "Scheduled", date: "03 Feb 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", type: "Fertility check", status: "In Progress", date: "25 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", type: "PPR vaccination", status: "Scheduled", date: "04 Feb 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", type: "Nutritional screening", status: "Completed", date: "24 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", type: "Brucellosis test", status: "Scheduled", date: "05 Feb 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", type: "Coccidiosis screening", status: "In Progress", date: "26 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", type: "Anthrax vaccination", status: "Scheduled", date: "06 Feb 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", type: "Rabies vaccination", status: "Completed", date: "23 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredScreenings = screenings.filter(s =>
    filter === "All" ? true : s.status === filter
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled": return "badge bg-info text-dark"
      case "In Progress": return "badge bg-warning text-dark"
      case "Completed": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  // Pie chart: distribution by status
  const pieData = {
    labels: ["Scheduled", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          screenings.filter(s => s.status === "Scheduled").length,
          screenings.filter(s => s.status === "In Progress").length,
          screenings.filter(s => s.status === "Completed").length
        ],
        backgroundColor: ["#17a2b8", "#ffc107", "#28a745"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: weekly trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Screenings Conducted",
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
    <DashboardSection title="Preventive Screenings">
      <p className="mb-3">Routine herd preventive screenings across Zimbabwean farms:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Scheduled", "In Progress", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Screenings list */}
      <ul className="list-group mb-3">
        {filteredScreenings.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.farmer} • {s.animal} • {s.type}</span>
            <div>
              <span className={getStatusClass(s.status)}>{s.status}</span>
              <small className="text-muted ms-2">{s.date}</small>
            </div>
          </li>
        ))}
        {filteredScreenings.length === 0 && (
          <li className="list-group-item text-muted">No screenings found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Screenings Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Screening Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
