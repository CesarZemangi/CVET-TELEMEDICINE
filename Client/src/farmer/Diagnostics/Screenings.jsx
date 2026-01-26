import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
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

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function Screenings() {
  const [filter, setFilter] = useState("All")

  const screenings = [
    { id: 1, type: "Deworming", date: "20 Feb 2026", status: "Scheduled" },
    { id: 2, type: "Vaccination (Foot and Mouth)", date: "15 Feb 2026", status: "Completed" },
    { id: 3, type: "General Health Check", date: "10 Feb 2026", status: "Completed" },
    { id: 4, type: "Nutritional Screening", date: "05 Feb 2026", status: "Completed" },
    { id: 5, type: "Respiratory Screening", date: "25 Jan 2026", status: "Completed" },
    { id: 6, type: "Blood Test", date: "22 Jan 2026", status: "Completed" },
    { id: 7, type: "Skin Examination", date: "18 Jan 2026", status: "Completed" },
    { id: 8, type: "Parasite Screening", date: "12 Jan 2026", status: "Completed" },
    { id: 9, type: "Vaccination (Rabies)", date: "28 Feb 2026", status: "Scheduled" },
    { id: 10, type: "Follow-up Health Check", date: "05 Mar 2026", status: "Scheduled" }
  ]

  const filteredScreenings = screenings.filter(s =>
    filter === "All" ? true : s.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Scheduled") return "text-primary fw-bold"
    if (status === "Completed") return "text-success fw-bold"
    return ""
  }

  // Summary chart
  const pieData = {
    labels: ["Scheduled", "Completed"],
    datasets: [
      {
        data: [
          screenings.filter(s => s.status === "Scheduled").length,
          screenings.filter(s => s.status === "Completed").length
        ],
        backgroundColor: ["#1E90FF", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: screenings over time
  const lineData = {
    labels: screenings.map(s => s.date),
    datasets: [
      {
        label: "Scheduled",
        data: screenings.map(s => (s.status === "Scheduled" ? 1 : 0)),
        borderColor: "#1E90FF",
        backgroundColor: "#87CEFA",
        tension: 0.3,
        fill: true
      },
      {
        label: "Completed",
        data: screenings.map(s => (s.status === "Completed" ? 1 : 0)),
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
      title: { display: true }
    }
  }

  return (
    <DashboardSection title="Preventive Screenings (Zimbabwe)">
      <p>Upcoming and past preventive screenings for cattle, goats, and sheep.</p>

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Scheduled", "Completed"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Screenings list */}
      <ul className="list-group">
        {filteredScreenings.map(screening => (
          <li key={screening.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{screening.type}</span>
            <small className={`text-muted ${getStatusClass(screening.status)}`}>
              {screening.date} — {screening.status}
            </small>
          </li>
        ))}
        {filteredScreenings.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} screenings found.</li>
        )}
      </ul>

      {/* Summary chart */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Summary</h6>
        <Pie data={pieData} options={options} />
      </div>

      {/* Timeline chart */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Screenings Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Screenings Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
