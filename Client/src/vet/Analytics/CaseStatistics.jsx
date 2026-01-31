import DashboardSection from "../../components/dashboard/DashboardSection";
import React from "react"
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

export default function CaseStatistics() {
  const stats = [
    { id: 1, metric: "Total Cases", value: "120", status: "Recorded" },
    { id: 2, metric: "Resolved Cases", value: "94", status: "Resolved" },
    { id: 3, metric: "Pending Cases", value: "26", status: "Pending" },
    { id: 4, metric: "Emergency Cases", value: "15", status: "Critical" },
    { id: 5, metric: "Surgical Cases", value: "10", status: "Completed" },
    { id: 6, metric: "Follow-up Cases", value: "22", status: "Ongoing" },
    { id: 7, metric: "Medication Cases", value: "35", status: "Resolved" },
    { id: 8, metric: "Nutrition Cases", value: "18", status: "Improving" },
    { id: 9, metric: "Vaccination Cases", value: "50", status: "Completed" },
    { id: 10, metric: "Overall Resolution Rate", value: "78%", status: "This Month" }
  ]

  const pieData = {
    labels: ["Surgical", "Medication", "Nutrition", "Vaccination", "Emergency"],
    datasets: [
      {
        data: [10, 35, 18, 50, 15],
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C", "#DEB887"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Resolution Rate (%)",
        data: [70, 75, 78, 80],
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
    <DashboardSection title="Case Statistics">
      <p className="mb-3">Veterinary case statistics for this month:</p>

      <ul className="list-group mb-3">
        {stats.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.metric} • {s.value}</span>
            <small className="text-muted">{s.status}</small>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Case Type Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Resolution Rate Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
