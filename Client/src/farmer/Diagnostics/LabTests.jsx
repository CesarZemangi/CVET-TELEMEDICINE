import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
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

export default function LabTests() {
  const [filter, setFilter] = useState("All")

  const tests = [
    { animal: "Cow #A12", test: "Blood Test", result: "Normal", date: "12 Feb 2026" },
    { animal: "Goat #B07", test: "Fecal Examination", result: "Parasites detected", date: "14 Feb 2026" },
    { animal: "Sheep #C21", test: "Milk Quality Test", result: "Fat content 4.1%", date: "15 Feb 2026" },
    { animal: "Cow #A15", test: "Urine Analysis", result: "High protein", date: "16 Feb 2026" },
    { animal: "Goat #B11", test: "Respiratory Culture", result: "No infection", date: "17 Feb 2026" },
    { animal: "Sheep #C09", test: "Skin Scraping", result: "Mild dermatitis", date: "18 Feb 2026" },
    { animal: "Cow #A18", test: "Serology Test", result: "Positive antibodies", date: "19 Feb 2026" },
    { animal: "Goat #B14", test: "Blood Chemistry", result: "Elevated glucose", date: "20 Feb 2026" },
    { animal: "Sheep #C25", test: "PCR Test", result: "Negative", date: "21 Feb 2026" },
    { animal: "Cow #A20", test: "Urine Culture", result: "Bacterial growth", date: "22 Feb 2026" }
  ]

  // Abnormal keywords
  const abnormalKeywords = ["Parasites", "High", "Positive", "Bacterial", "Elevated", "dermatitis"]

  const filteredTests = tests.filter(t => {
    if (filter === "All") return true
    const isAbnormal = abnormalKeywords.some(k => t.result.toLowerCase().includes(k.toLowerCase()))
    return filter === "Abnormal" ? isAbnormal : !isAbnormal
  })

  const getResultClass = (result) => {
    return abnormalKeywords.some(k => result.toLowerCase().includes(k.toLowerCase()))
      ? "text-danger fw-bold"
      : "text-success"
  }

  // Summary chart
  const pieData = {
    labels: ["Normal", "Abnormal"],
    datasets: [
      {
        data: [
          tests.filter(t => !abnormalKeywords.some(k => t.result.toLowerCase().includes(k.toLowerCase()))).length,
          tests.filter(t => abnormalKeywords.some(k => t.result.toLowerCase().includes(k.toLowerCase()))).length
        ],
        backgroundColor: ["#228B22", "#FF4500"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Trend chart: abnormal results over time
  const lineData = {
    labels: tests.map(t => t.date),
    datasets: [
      {
        label: "Abnormal Results",
        data: tests.map(t =>
          abnormalKeywords.some(k => t.result.toLowerCase().includes(k.toLowerCase())) ? 1 : 0
        ),
        borderColor: "#FF4500",
        backgroundColor: "#FFA07A",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true }
    }
  }

  return (
    <DashboardSection title="Lab Test Results (Zimbabwe)">
      <p>Diagnostic lab results for cattle, goats, and sheep.</p>

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Normal", "Abnormal"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results table */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Test</th>
            <th>Result</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTests.map((t, index) => (
            <tr key={index}>
              <td>{t.animal}</td>
              <td>{t.test}</td>
              <td className={getResultClass(t.result)}>{t.result}</td>
              <td>{t.date}</td>
            </tr>
          ))}
          {filteredTests.length === 0 && (
            <tr>
              <td colSpan="4" className="text-muted">No {filter.toLowerCase()} results found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary chart */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Summary</h6>
        <Pie data={pieData} options={options} />
      </div>

      {/* Trend chart */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Abnormal Results Trend</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Abnormal Results Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
