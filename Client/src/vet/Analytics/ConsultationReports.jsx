import DashboardSection from "../../components/dashboard/DashboardSection";


import React from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"


ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function ConsultationReports() {
  const reports = [
    { id: 1, metric: "Total Consultations", value: "150", status: "This Month" },
    { id: 2, metric: "Average Duration", value: "25 min", status: "Reduced" },
    { id: 3, metric: "Follow-up Consultations", value: "40", status: "Ongoing" },
    { id: 4, metric: "Emergency Consultations", value: "12", status: "Critical" },
    { id: 5, metric: "Nutrition Consultations", value: "28", status: "Stable" },
    { id: 6, metric: "Surgical Consultations", value: "15", status: "Completed" },
    { id: 7, metric: "Medication Consultations", value: "35", status: "Resolved" },
    { id: 8, metric: "Vaccination Consultations", value: "20", status: "Completed" },
    { id: 9, metric: "Telemedicine Consultations", value: "50", status: "Improving" },
    { id: 10, metric: "Overall Satisfaction", value: "92%", status: "High" }
  ]

  // Bar chart: consultations by type
  const barData = {
    labels: ["Nutrition", "Surgical", "Medication", "Vaccination", "Emergency"],
    datasets: [
      {
        label: "Consultations",
        data: [28, 15, 35, 20, 12],
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Line chart: average consultation duration trend
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Avg Duration (min)",
        data: [32, 28, 26, 25],
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
    <DashboardSection title="Consultation Reports">
      <p className="mb-3">Veterinary consultation analytics showing efficiency and case distribution:</p>

      <ul className="list-group mb-3">
        {reports.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{r.metric} • {r.value}</span>
            <small className="text-muted">{r.status}</small>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Consultations by Type</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Average Duration Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
