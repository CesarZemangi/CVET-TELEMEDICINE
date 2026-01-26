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
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function ImagingReports() {
  const reports = [
    { id: 1, type: "Ultrasound", animal: "Nguni Cow #A12", finding: "Normal", severity: "Normal", date: "02 Jan 2026" },
    { id: 2, type: "X-ray", animal: "Matabele Goat #B07", finding: "Fracture healed", severity: "Minor", date: "03 Jan 2026" },
    { id: 3, type: "Ultrasound", animal: "Indigenous Chicken Flock", finding: "No abnormalities", severity: "Normal", date: "04 Jan 2026" },
    { id: 4, type: "MRI", animal: "Nguni Cow #A15", finding: "Joint inflammation", severity: "Critical", date: "05 Jan 2026" },
    { id: 5, type: "X-ray", animal: "Sheep #C09", finding: "Clear lungs", severity: "Normal", date: "06 Jan 2026" },
    { id: 6, type: "Ultrasound", animal: "Nguni Cow #A18", finding: "Pregnancy confirmed", severity: "Normal", date: "07 Jan 2026" },
    { id: 7, type: "CT Scan", animal: "Goat #B14", finding: "Digestive blockage", severity: "Critical", date: "08 Jan 2026" },
    { id: 8, type: "Ultrasound", animal: "Nguni Cow #A20", finding: "Normal", severity: "Normal", date: "09 Jan 2026" },
    { id: 9, type: "X-ray", animal: "Sheep #C25", finding: "Minor fracture", severity: "Minor", date: "10 Jan 2026" },
    { id: 10, type: "Ultrasound", animal: "Nguni Cow #A22", finding: "Normal", severity: "Normal", date: "11 Jan 2026" }
  ]

  // Pie chart: imaging types distribution
  const pieData = {
    labels: ["Ultrasound", "X-ray", "MRI", "CT Scan"],
    datasets: [
      {
        data: [5, 3, 1, 1],
        backgroundColor: ["#A0522D", "#CD853F", "#8B4513", "#D2B48C"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: imaging reports trend
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Reports Reviewed",
        data: [2, 3, 2, 3],
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

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical": return "badge bg-danger"
      case "Minor": return "badge bg-warning text-dark"
      case "Normal": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  return (
    <DashboardSection title="Imaging Reports">
      <p className="mb-3">Veterinary imaging diagnostics across Zimbabwean farms:</p>

      <ul className="list-group mb-3">
        {reports.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{r.type} • {r.animal} • {r.finding}</span>
            <div>
              <span className={getSeverityClass(r.severity)}>{r.severity}</span>
              <small className="text-muted ms-2">{r.date}</small>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Imaging Types Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Reports Reviewed Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
