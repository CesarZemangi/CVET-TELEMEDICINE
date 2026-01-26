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

export default function LivestockPerformance() {
  // Bar chart: performance metrics
  const barData = {
    labels: [
      "Milk Yield",
      "Weight Gain",
      "Calving Success",
      "Mortality",
      "Feed Efficiency",
      "Wool Yield",
      "Egg Production",
      "Vaccination",
      "Downtime",
      "Compliance"
    ],
    datasets: [
      {
        label: "Performance Metrics (%)",
        data: [12, 9, 95, 98.2, 14, 7, 11, 96, 20, 93], // localized sample values
        backgroundColor: [
          "#17a2b8",
          "#ffc107",
          "#28a745",
          "#dc3545",
          "#8B4513",
          "#A0522D",
          "#CD853F",
          "#2E8B57",
          "#4682B4",
          "#6A5ACD"
        ]
      }
    ]
  }

  // Line chart: quarterly livestock performance trend (example data)
  const lineData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Overall Performance Score",
        data: [72, 78, 83, 89],
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
    <DashboardSection title="Livestock Performance (Zimbabwe)">
      <p className="mb-3">Key livestock performance indicators across Zimbabwean farms:</p>

      {/* Bar chart */}
      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Performance Metrics by Category</h6>
        <Bar data={barData} options={options} />
      </div>

      {/* Line chart */}
      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Quarterly Performance Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      {/* Narrative summary */}
      <ul className="mt-3">
        <li>Milk production in Mashonaland dairy cooperatives increased by 12% compared to last quarter.</li>
        <li>Average daily weight gain improved by 9% across communal cattle and goat herds.</li>
        <li>Calving success rate reached 95% this season in Matabeleland beef herds.</li>
        <li>Mortality rate dropped to 1.8%, lowest in 2 years, especially in goat flocks.</li>
        <li>Feed conversion efficiency improved by 14% after diet adjustments using sorghum stover and maize silage.</li>
        <li>Wool yield increased by 7% in sheep flocks in Manicaland highlands.</li>
        <li>Egg production rose by 11% among poultry layers in peri-urban Harare farms.</li>
        <li>Vaccination coverage achieved 96% of livestock (PPR in goats, Newcastle in poultry).</li>
        <li>Health-related downtime reduced by 20% across all animals due to improved kraal hygiene and tick control.</li>
        <li>Farmer compliance with feeding schedules reached 93%, supported by extension officers and mobile vet services.</li>
      </ul>
    </DashboardSection>
  )
}
