import React, { useState } from "react"
import { Pie, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function MedicationHistory() {
  const [filter, setFilter] = useState("All")

  // Example dataset with species breakdown
  const medicationRecords = [
    { species: "Cattle", type: "Antibiotics" },
    { species: "Cattle", type: "Painkillers" },
    { species: "Cattle", type: "Vitamins" },
    { species: "Goat", type: "Antibiotics" },
    { species: "Goat", type: "Vaccines" },
    { species: "Sheep", type: "Painkillers" },
    { species: "Sheep", type: "Vitamins" },
    { species: "Sheep", type: "Vaccines" },
    { species: "Cattle", type: "Antibiotics" },
    { species: "Goat", type: "Painkillers" }
  ]

  // Apply filter
  const filteredRecords = medicationRecords.filter(m =>
    filter === "All" ? true : m.species === filter
  )

  // Pie chart: distribution of medication types (filtered)
  const types = ["Antibiotics", "Painkillers", "Vitamins", "Vaccines"]
  const pieData = {
    labels: types,
    datasets: [
      {
        data: types.map(t => filteredRecords.filter(m => m.type === t).length),
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: dosage trends over weeks (static demo data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Dosages Administered",
        data: [12, 18, 15, 20],
        borderColor: "#A0522D",
        backgroundColor: "#D2B48C",
        tension: 0.3,
        fill: true
      }
    ]
  }

  // Species breakdown chart (stacked bar, filtered)
  const species = [...new Set(filteredRecords.map(m => m.species))]
  const barData = {
    labels: species,
    datasets: types.map(type => ({
      label: type,
      data: species.map(sp => filteredRecords.filter(m => m.species === sp && m.type === type).length),
      backgroundColor:
        type === "Antibiotics" ? "#8B4513" :
        type === "Painkillers" ? "#A0522D" :
        type === "Vitamins" ? "#CD853F" :
        "#D2B48C"
    }))
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  }

  return (
    <DashboardSection title="Medication History (Zimbabwe)">
      <p className="mb-3">View past medications and dosage records for cattle, goats, and sheep.</p>

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Cattle", "Goat", "Sheep"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Medication Types</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Dosage Trends</h6>
        <Line data={lineData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "500px", height: "300px" }}>
        <h6>Species Breakdown</h6>
        <Bar data={barData} options={{ ...options, title: { text: "Medication Types by Species" } }} />
      </div>
    </DashboardSection>
  )
}
