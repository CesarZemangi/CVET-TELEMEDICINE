import React from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function HealthTrends() {
  // Bar chart: improvements by category
  const barData = {
    labels: [
      "Respiratory",
      "Digestive",
      "Vaccination",
      "Weight Gain",
      "Milk Yield",
      "Mortality",
      "Compliance",
      "Stress"
    ],
    datasets: [
      {
        label: "Improvement (%)",
        data: [18, 15, 92, 12, 9, 98, 95, 70], // localized sample values
        backgroundColor: [
          "#17a2b8",
          "#ffc107",
          "#28a745",
          "#8B4513",
          "#A0522D",
          "#dc3545",
          "#2E8B57",
          "#4682B4"
        ]
      }
    ]
  }

  // Line chart: weekly health trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Overall Health Score",
        data: [72, 75, 78, 82, 85, 88],
        borderColor: "#2E8B57",
        backgroundColor: "#98FB98",
        tension: 0.3,
        fill: true
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

  return (
    <DashboardSection title="Health Trends (Zimbabwe)">
      <p className="mb-3">Key herd health improvements across Zimbabwean farms:</p>

      {/* Bar chart */}
      <div className="mb-3" style={{ width: "400px", height: "250px" }}>
        <h6>Health Improvements by Category</h6>
        <Bar data={barData} options={options} />
      </div>

      {/* Line chart */}
      <div className="mb-3" style={{ width: "400px", height: "250px" }}>
        <h6>Weekly Overall Health Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      {/* Narrative summary */}
      <ul className="mt-3">
        <li>Respiratory issues in cattle decreased by 18% compared to last month.</li>
        <li>Digestive disorders reduced by 15% after dietary adjustments using sorghum stover and maize silage.</li>
        <li>Vaccination coverage reached 92% of livestock (PPR in goats, Newcastle in poultry).</li>
        <li>Average weight gain improved by 12% across communal and commercial herds.</li>
        <li>Milk yield in dairy cows increased steadily, up 9% this quarter in Midlands cooperatives.</li>
        <li>Mortality rate dropped to 2%, lowest in 12 months, especially in goat flocks.</li>
        <li>Farmer compliance with treatment plans rose to 95% with support from extension officers.</li>
        <li>Stress indicators reduced in 70% of cases after improved kraal management and tick control.</li>
      </ul>
    </DashboardSection>
  )
}
