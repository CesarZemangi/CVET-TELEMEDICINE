import React, { useState } from "react"
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

export default function LabResults() {
  const [filter, setFilter] = useState("All")

  const results = [
    { id: "LR-201", test: "Blood Test", result: "Normal", status: "Completed", date: "Jan 20, 2026" },
    { id: "LR-202", test: "Urine Analysis", result: "High protein", status: "Completed", date: "Jan 18, 2026" },
    { id: "LR-203", test: "Milk Quality Test", result: "Fat content 4.2%", status: "Completed", date: "Jan 19, 2026" },
    { id: "LR-204", test: "Fecal Examination", result: "Parasites detected", status: "Completed", date: "Jan 21, 2026" },
    { id: "LR-205", test: "Respiratory Culture", result: "No infection", status: "Completed", date: "Jan 15, 2026" },
    { id: "LR-206", test: "Skin Scraping", result: "Mild dermatitis", status: "Completed", date: "Jan 16, 2026" },
    { id: "LR-207", test: "Serology Test", result: "Positive antibodies", status: "Completed", date: "Jan 22, 2026" },
    { id: "LR-208", test: "Urine Culture", result: "Bacterial growth", status: "Completed", date: "Jan 23, 2026" },
    { id: "LR-209", test: "Blood Chemistry", result: "Elevated glucose", status: "Completed", date: "Jan 17, 2026" },
    { id: "LR-210", test: "PCR Test", result: "Negative", status: "Completed", date: "Jan 24, 2026" }
  ]

  // Abnormal keywords
  const abnormalKeywords = ["High", "Parasites", "Positive", "Bacterial", "Elevated", "dermatitis"]

  const filteredResults = results.filter(res => {
    if (filter === "All") return true
    const isAbnormal = abnormalKeywords.some(k => res.result.toLowerCase().includes(k.toLowerCase()))
    return filter === "Abnormal" ? isAbnormal : !isAbnormal
  })

  const getResultClass = (result) => {
    return abnormalKeywords.some(k => result.toLowerCase().includes(k.toLowerCase()))
      ? "text-danger fw-bold"
      : "text-success"
  }

  // Pie chart summary
  const pieData = {
    labels: ["Normal", "Abnormal"],
    datasets: [
      {
        data: [
          results.filter(r => !abnormalKeywords.some(k => r.result.toLowerCase().includes(k.toLowerCase()))).length,
          results.filter(r => abnormalKeywords.some(k => r.result.toLowerCase().includes(k.toLowerCase()))).length
        ],
        backgroundColor: ["#228B22", "#FF4500"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart trend: abnormal results over time
  const lineData = {
    labels: results.map(r => r.date),
    datasets: [
      {
        label: "Abnormal Results Count",
        data: results.map(r =>
          abnormalKeywords.some(k => r.result.toLowerCase().includes(k.toLowerCase())) ? 1 : 0
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
    <div>
      <h4>Lab Results (Zimbabwe)</h4>
      <p>View diagnostic lab results for cattle, goats, and sheep.</p>

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

      {/* Results list */}
      <div className="row">
        {filteredResults.map(res => (
          <div key={res.id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{res.test}</h6>
                <p className={`card-text ${getResultClass(res.result)}`}>{res.result}</p>
                <small className="text-muted">{res.date} — {res.status}</small>
              </div>
            </div>
          </div>
        ))}
        {filteredResults.length === 0 && (
          <div className="col-12 text-muted">No {filter.toLowerCase()} results found.</div>
        )}
      </div>

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
    </div>
  )
}
