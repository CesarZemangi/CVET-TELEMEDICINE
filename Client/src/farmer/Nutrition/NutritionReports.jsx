import DashboardSection from "../../components/dashboard/DashboardSection"

import React, { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title)

export default function NutritionReports() {
  const [filter, setFilter] = useState("All")

  // Weight gain data
  const barData = {
    labels: ["Cows", "Goats", "Sheep"],
    datasets: [
      {
        label: "Avg Weight Gain (kg)",
        data: [12, 8, 6],
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F"]
      }
    ]
  }

  // Feed intake trend
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Feed Intake (kg/day)",
        data: [22, 24, 26, 25],
        borderColor: "#A0522D",
        backgroundColor: "#D2B48C",
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

  // Conditional alert: feed intake drop
  const intakeData = [22, 24, 26, 25]
  const intakeDrop = intakeData.some((val, idx, arr) => idx > 0 && val < arr[idx - 1])

  return (
    <DashboardSection title="Nutrition Reports (Zimbabwe)">
      <p className="mb-3">Recent nutrition-related reports show improved weight gain and stable feed intake.</p>

      {/* Conditional alert */}
      {intakeDrop && (
        <div className="alert alert-warning fw-bold">
          ⚠️ Feed intake dropped compared to previous week. Monitor herd nutrition closely!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Cows", "Goats", "Sheep"].map(f => (
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
      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Average Weight Gain</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Feed Intake Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      {/* Summary insights */}
      <div className="mt-3">
        <p><strong>Insights:</strong></p>
        <ul>
          <li>Cows gained the most weight (12kg avg).</li>
          <li>Goats showed moderate gain (8kg avg).</li>
          <li>Sheep had the lowest gain (6kg avg).</li>
          <li>Feed intake peaked in Week 3 (26kg/day).</li>
        </ul>
      </div>
    </DashboardSection>
  )
}
