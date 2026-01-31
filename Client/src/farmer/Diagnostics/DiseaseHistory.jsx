import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Line, Scatter } from "react-chartjs-2"
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

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function DiseaseHistory() {
  const [speciesFilter, setSpeciesFilter] = useState("All")

  const diseaseData = {
    All: [35, 25, 15, 15, 10],
    Cattle: [40, 30, 10, 10, 10],
    Goats: [20, 10, 15, 40, 15],
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

  const lineDataRegions = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      { label: "Mashonaland", data: [42, 55, 65, 72, 80, 87], borderColor: "#8B4513", backgroundColor: "#CD853F", tension: 0.3, fill: false },
      { label: "Matabeleland", data: [38, 50, 60, 68, 75, 82], borderColor: "#2E8B57", backgroundColor: "#98FB98", tension: 0.3, fill: false },
      { label: "Midlands", data: [40, 52, 63, 70, 78, 85], borderColor: "#4682B4", backgroundColor: "#87CEFA", tension: 0.3, fill: false },
      { label: "Manicaland", data: [44, 57, 67, 74, 82, 88], borderColor: "#6A5ACD", backgroundColor: "#9370DB", tension: 0.3, fill: false }
    ]
  }

  const scatterData = {
    datasets: [
      { label: "Cases", data: [{ x: 2, y: 5 }, { x: 3, y: 7 }, { x: 4, y: 12 }, { x: 5, y: 15 }, { x: 6, y: 20 }], backgroundColor: "#A0522D" }
    ]
  }

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" }, title: { display: true } } }

  return (
    <DashboardSection title="Disease History (Zimbabwe)">
      <p className="mb-3">
        Diagnostic records filtered by species and region. Example: Goat #B07 treated for foot rot in Mashonaland.
      </p>

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

      <div className="mb-4" style={{ width: "300px", height: "300px" }}>
        <h6>Disease Distribution</h6>
        <Pie data={pieData} options={{ ...options, title: { text: "Disease Cases Distribution" } }} />
      </div>

      <div className="mb-4" style={{ width: "500px", height: "300px" }}>
        <h6>Recovery Trends by Region</h6>
        <Line data={lineDataRegions} options={{ ...options, title: { text: "Recovery Rate Comparison Across Regions" } }} />
      </div>

      <div className="mb-4" style={{ width: "400px", height: "250px" }}>
        <h6>Severity vs Recovery Time</h6>
        <Scatter data={scatterData} options={{ ...options, title: { text: "Severity vs Recovery Days" } }} />
      </div>
    </DashboardSection>
  )
}
