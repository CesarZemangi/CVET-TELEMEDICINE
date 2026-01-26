import DashboardSection from "../../components/dashboard/DashboardSection";


import React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function ExportReports() {
  const reports = [
    { id: 1, type: "Consultation Reports", frequency: 12 },
    { id: 2, type: "Treatment Plans", frequency: 9 },
    { id: 3, type: "Medication History", frequency: 15 },
    { id: 4, type: "Surgical Cases", frequency: 7 },
    { id: 5, type: "Nutrition Reports", frequency: 10 },
    { id: 6, type: "Imaging Reports", frequency: 6 },
    { id: 7, type: "Follow-up Visits", frequency: 8 },
    { id: 8, type: "Vaccination Records", frequency: 14 },
    { id: 9, type: "Case Statistics", frequency: 11 },
    { id: 10, type: "Animal Health Trends", frequency: 13 }
  ]

  // Bar chart: export frequency by report type
  const barData = {
    labels: reports.map(r => r.type),
    datasets: [
      {
        label: "Exports This Month",
        data: reports.map(r => r.frequency),
        backgroundColor: "#A0522D"
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    },
    scales: {
      x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } }
    }
  }

  return (
    <DashboardSection title="Export Reports">
      <p className="mb-3">Select and export veterinary reports:</p>

      <ul className="list-group mb-3">
        {reports.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{r.type}</span>
            <button className="btn btn-outline-brown btn-sm">Export</button>
          </li>
        ))}
      </ul>

      <div style={{ width: "100%", height: "300px" }}>
        <h6>Export Frequency by Report Type</h6>
        <Bar data={barData} options={options} />
      </div>
    </DashboardSection>
  )
}

