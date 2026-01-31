import { useState, useEffect } from "react"
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function HealthTrends() {
  const [barStats, setBarStats] = useState([])
  const [lineStats, setLineStats] = useState([])
  const [summaryRows, setSummaryRows] = useState([])

  useEffect(() => {
    fetch("/api/health/trends")
      .then(res => res.json())
      .then(data => {
        setBarStats(data.byCategory)
        setLineStats(data.weekly)
        setSummaryRows(data.summary)
      })
      .catch(err => console.error(err))
  }, [])

  const barData = {
    labels: barStats.map(item => item.category),
    datasets: [
      {
        label: "Improvement (%)",
        data: barStats.map(item => item.value),
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

  const lineData = {
    labels: lineStats.map(item => item.week),
    datasets: [
      {
        label: "Overall Health Score",
        data: lineStats.map(item => item.score),
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
      <p className="mb-3">
        Key herd health improvements across Zimbabwean farms
      </p>

      <div className="mb-3" style={{ width: "400px", height: "250px" }}>
        <h6>Health Improvements by Category</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "400px", height: "250px" }}>
        <h6>Weekly Overall Health Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      <div className="mt-4">
        <h6>Health Summary</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Category</th>
              <th>Result</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map(row => (
              <tr key={row.id}>
                <td>{row.category}</td>
                <td>{row.result}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  )
}
