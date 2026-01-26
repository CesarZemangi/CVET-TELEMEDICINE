import React from "react"
import { Bar, Line, Scatter } from "react-chartjs-2"
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
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function TreatmentEffectiveness() {
  const metrics = [
    { id: 1, metric: "Total Treatments", value: "120", status: "This Month" },
    { id: 2, metric: "Successful Recoveries", value: "95", status: "High" },
    { id: 3, metric: "Partial Recoveries", value: "15", status: "Moderate" },
    { id: 4, metric: "Failed Treatments", value: "10", status: "Low" },
    { id: 5, metric: "Average Recovery Time", value: "7 days", status: "Improving" },
    { id: 6, metric: "Antibiotic Effectiveness", value: "88%", status: "Strong" },
    { id: 7, metric: "Surgical Success Rate", value: "92%", status: "High" },
    { id: 8, metric: "Nutritional Therapy Success", value: "80%", status: "Stable" },
    { id: 9, metric: "Vaccination Effectiveness", value: "97%", status: "Excellent" },
    { id: 10, metric: "Overall Effectiveness", value: "89%", status: "This Month" }
  ]

  // Bar chart: treatment outcomes
  const barData = {
    labels: ["Successful", "Partial", "Failed"],
    datasets: [
      {
        label: "Treatment Outcomes",
        data: [95, 15, 10],
        backgroundColor: ["#2E8B57", "#CD853F", "#A0522D"]
      }
    ]
  }

  // Line chart: recovery success trend
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Recovery Success (%)",
        data: [85, 87, 89, 92],
        borderColor: "#2E8B57",
        backgroundColor: "#98FB98",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Scatter plot: recovery time vs treatment type
  const scatterData = {
    datasets: [
      {
        label: "Recovery Time vs Treatment",
        data: [
          { x: 7, y: 88 }, // Antibiotics: 7 days, 88% effectiveness
          { x: 10, y: 92 }, // Surgery: 10 days, 92% effectiveness
          { x: 6, y: 80 }, // Nutrition therapy: 6 days, 80% effectiveness
          { x: 5, y: 97 }  // Vaccination: 5 days, 97% effectiveness
        ],
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
    <DashboardSection title="Treatment Effectiveness">
      <p className="mb-3">Veterinary treatment effectiveness analytics showing recovery success, outcomes, and efficiency trends:</p>

      <ul className="list-group mb-3">
        {metrics.map(m => (
          <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{m.metric} • {m.value}</span>
            <small className="text-muted">{m.status}</small>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Treatment Outcomes</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Recovery Success Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Recovery Time vs Treatment Type</h6>
        <Scatter data={scatterData} options={options} />
      </div>
    </DashboardSection>
  )
}
