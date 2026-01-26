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

export default function MedicationHistory() {
  const [filter, setFilter] = useState("All")

  const medicationTypes = ["Antibiotics", "Painkillers", "Vitamins", "Vaccines"]
  const medicationData = [45, 25, 15, 15] // sample distribution

  // Calculate totals
  const total = medicationData.reduce((a, b) => a + b, 0)
  const antibioticsShare = (medicationData[0] / total) * 100

  // Pie chart: medication types distribution
  const pieData = {
    labels: medicationTypes,
    datasets: [
      {
        data: medicationData,
        backgroundColor: ["#FF4500", "#A0522D", "#CD853F", "#228B22"], // antibiotics red, vaccines green
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: treatments completed per month
  const barData = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Completed Treatments",
        data: [5, 8, 6, 7, 4],
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Line chart: medication usage trend
  const lineData = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Antibiotics",
        data: [2, 3, 2, 4, 1],
        borderColor: "#FF4500",
        backgroundColor: "#FFA07A",
        tension: 0.3,
        fill: true
      },
      {
        label: "Vaccines",
        data: [1, 2, 1, 2, 2],
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
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
    <DashboardSection title="Medication History (Zimbabwe)">
      <p className="mb-3">Completed antibiotic and vaccine treatments last month for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {antibioticsShare > 50 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ Antibiotics usage is {Math.round(antibioticsShare)}% of total — potential overuse risk!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...medicationTypes].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Medication Types</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Treatments Completed (Last 5 Months)</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "500px", height: "300px" }}>
        <h6>Medication Usage Trend</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Medication Trend Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
