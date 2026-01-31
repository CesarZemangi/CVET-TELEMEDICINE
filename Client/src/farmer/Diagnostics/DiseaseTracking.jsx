import React, { useState } from "react"
import { Pie, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function DiseaseTracking() {
  const [speciesFilter, setSpeciesFilter] = useState("All")
  const [regionFilter, setRegionFilter] = useState("All")

  const diseaseData = {
    All: [30, 25, 20, 15, 10],
    Cattle: [40, 30, 10, 10, 10],
    Goats: [20, 15, 10, 35, 20],
    Poultry: [10, 5, 60, 15, 10],
    Sheep: [25, 20, 15, 20, 20]
  }

  const pieData = {
    labels: ["Foot-and-Mouth", "Mastitis", "Newcastle (Poultry)", "PPR (Goats)", "Anthrax"],
    datasets: [
      {
        data: diseaseData[speciesFilter],
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C", "#6A5ACD"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const lineData = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: `Reported Cases — ${speciesFilter}, ${regionFilter}`,
        data: [14, 20, 28, 22, 18, 12],
        borderColor: "#8B4513",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const barData = {
    labels: ["Foot-and-Mouth", "Mastitis", "Newcastle", "PPR", "Anthrax"],
    datasets: [
      {
        label: `Recurrence Count — ${speciesFilter}, ${regionFilter}`,
        data: [9, 6, 7, 5, 4],
        backgroundColor: ["#A0522D", "#CD853F", "#D2B48C", "#8B4513", "#6A5ACD"]
      }
    ]
  }

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" }, title: { display: true } } }

  return (
    <div>
      <h4>Disease Tracking (Zimbabwe)</h4>
      <p>Track recurring diseases and outbreak history across communal and commercial farms.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Cattle", "Goats", "Poultry", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${speciesFilter === species ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setSpeciesFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Mashonaland", "Matabeleland", "Midlands", "Manicaland"].map(region => (
          <button
            key={region}
            className={`btn btn-sm ${regionFilter === region ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setRegionFilter(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="mb-4" style={{ width: "350px", height: "300px" }}>
        <h6>Disease Distribution</h6>
        <Pie data={pieData} options={{ ...options, title: { text: "Disease Cases Distribution" } }} />
      </div>

      <div className="mb-4" style={{ width: "500px", height: "300px" }}>
        <h6>Outbreak Trend (Last 6 Months)</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Monthly Outbreak Trend" } }} />
      </div>

      <div className="mb-4" style={{ width: "500px", height: "300px" }}>
        <h6>Recurrence Frequency</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Disease Recurrence Count" } }} />
      </div>
    </div>
  )
}
