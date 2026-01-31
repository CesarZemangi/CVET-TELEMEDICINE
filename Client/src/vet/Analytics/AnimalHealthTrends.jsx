import DashboardSection from "../../components/dashboard/DashboardSection";
import React from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function AnimalHealthTrends() {
  const trends = [
    { id: 1, metric: "Average Weight Gain", value: "+1.2 kg/week", status: "Improving" },
    { id: 2, metric: "Milk Yield", value: "+5% increase", status: "Stable" },
    { id: 3, metric: "Disease Incidence", value: "↓ 12%", status: "Improving" },
    { id: 4, metric: "Vaccination Coverage", value: "95%", status: "High" },
    { id: 5, metric: "Mortality Rate", value: "↓ 3%", status: "Improving" },
    { id: 6, metric: "Fertility Rate", value: "+8%", status: "Improving" },
    { id: 7, metric: "Feed Conversion Efficiency", value: "↑ 10%", status: "Stable" },
    { id: 8, metric: "Parasite Load", value: "↓ 15%", status: "Improving" },
    { id: 9, metric: "Respiratory Cases", value: "↓ 7%", status: "Improving" },
    { id: 10, metric: "Overall Herd Condition Score", value: "↑ 0.5 points", status: "Improving" }
  ]

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Herd Health Score",
        data: [72, 75, 78, 80],
        borderColor: "#2E8B57",
        backgroundColor: "#98FB98",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Disease Cases",
        data: [20, 15, 12, 10],
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
    }
  }

  return (
    <DashboardSection title="Animal Health Trends">
      <p className="mb-3">Veterinary health analytics showing herd performance and disease reduction trends:</p>

      <ul className="list-group mb-3">
        {trends.map(t => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{t.metric} • {t.value}</span>
            <small className="text-muted">{t.status}</small>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Herd Health Score Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Disease Incidence Reduction</h6>
        <Bar data={barData} options={options} />
      </div>
    </DashboardSection>
  )
}
