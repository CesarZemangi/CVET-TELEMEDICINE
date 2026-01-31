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

export default function LivestockPerformance() {
  const [barStats, setBarStats] = useState([])
  const [lineStats, setLineStats] = useState([])
  const [summaryRows, setSummaryRows] = useState([])

  useEffect(() => {
    fetch("/api/livestock/performance")
      .then(res => res.json())
      .then(data => {
        setBarStats(data.byMetric)
        setLineStats(data.quarterly)
        setSummaryRows(data.summary)
      })
      .catch(err => console.error(err))
  }, [])

  const barData = {
    labels: barStats.map(item => item.metric),
    datasets: [
      {
        label: "Performance Metrics (%)",
        data: barStats.map(item => item.value),
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

  const lineData = {
    labels: lineStats.map(item => item.period),
    datasets: [
      {
        label: "Overall Performance Score",
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
    <DashboardSection title="Livestock Performance (Zimbabwe)">
      <p className="mb-3">
        Key livestock performance indicators across Zimbabwean farms
      </p>

      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Performance Metrics by Category</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Quarterly Performance Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      <div className="mt-4">
        <h6>Performance Summary</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Result</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map(row => (
              <tr key={row.id}>
                <td>{row.metric}</td>
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
