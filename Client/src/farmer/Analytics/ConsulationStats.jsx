import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ConsultationStats() {
  const [stats, setStats] = useState([])
  const [speciesStats, setSpeciesStats] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("/api/consultations/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data.overall)
        setSpeciesStats(data.bySpecies)
        setTableData(data.recent)
      })
      .catch(err => console.error(err))
  }, [])

  const data = {
    labels: stats.map(item => item.label),
    datasets: [
      {
        label: "Consultations (Zimbabwe)",
        data: stats.map(item => item.value),
        backgroundColor: [
          "#8B4513",
          "#A0522D",
          "#CD853F",
          "#D2B48C",
          "#DEB887",
          "#F4A460",
          "#C19A6B",
          "#BC8F8F"
        ]
      }
    ]
  }

  const speciesData = {
    labels: speciesStats.map(item => item.species),
    datasets: [
      {
        label: "Consultations by Species",
        data: speciesStats.map(item => item.count),
        backgroundColor: ["#17a2b8", "#ffc107", "#28a745", "#dc3545"]
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Zimbabwe Veterinary Consultation Statistics Overview"
      }
    }
  }

  return (
    <DashboardSection title="Consultation Statistics (Zimbabwe)">
      <Bar data={data} options={options} />

      <div className="mt-4">
        <h6>Consultations by Species</h6>
        <Bar
          data={speciesData}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      <div className="mt-4">
        <h6>Recent Consultations</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Species</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(row => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.species}</td>
                <td>{row.status}</td>
                <td>{row.duration} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  )
}
