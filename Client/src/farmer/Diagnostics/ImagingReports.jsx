import React, { useState } from "react"
import { Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function ImagingReports() {
  const [typeFilter, setTypeFilter] = useState("All")
  const [speciesFilter, setSpeciesFilter] = useState("All")

  const reports = [
    { id: 1, animal: "Cow #A12", species: "Cattle", type: "X-Ray", finding: "Fracture detected", date: "02 Jan 2026" },
    { id: 2, animal: "Goat #B07", species: "Goat", type: "Ultrasound", finding: "Normal pregnancy", date: "04 Jan 2026" },
    { id: 3, animal: "Sheep #C21", species: "Sheep", type: "CT Scan", finding: "Respiratory blockage", date: "06 Jan 2026" },
    { id: 4, animal: "Cow #A15", species: "Cattle", type: "MRI", finding: "Joint inflammation", date: "08 Jan 2026" },
    { id: 5, animal: "Goat #B11", species: "Goat", type: "X-Ray", finding: "Hoof injury", date: "10 Jan 2026" },
    { id: 6, animal: "Sheep #C09", species: "Sheep", type: "Ultrasound", finding: "Liver cyst", date: "12 Jan 2026" },
    { id: 7, animal: "Cow #A18", species: "Cattle", type: "CT Scan", finding: "Digestive tract issue", date: "14 Jan 2026" },
    { id: 8, animal: "Goat #B14", species: "Goat", type: "MRI", finding: "Brain lesion", date: "16 Jan 2026" },
    { id: 9, animal: "Sheep #C25", species: "Sheep", type: "X-Ray", finding: "Bone density normal", date: "18 Jan 2026" },
    { id: 10, animal: "Cow #A20", species: "Cattle", type: "Ultrasound", finding: "Kidney stone", date: "20 Jan 2026" }
  ]

  const filteredReports = reports.filter(r =>
    (typeFilter === "All" ? true : r.type === typeFilter) &&
    (speciesFilter === "All" ? true : r.species === speciesFilter)
  )

  const pieData = {
    labels: ["X-Ray", "Ultrasound", "CT Scan", "MRI"],
    datasets: [
      {
        data: [
          filteredReports.filter(r => r.type === "X-Ray").length,
          filteredReports.filter(r => r.type === "Ultrasound").length,
          filteredReports.filter(r => r.type === "CT Scan").length,
          filteredReports.filter(r => r.type === "MRI").length
        ],
        backgroundColor: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const barData = {
    labels: ["Week 1", "Week 2", "Week 3"],
    datasets: [
      {
        label: "Reports Uploaded",
        data: [4, 3, 3],
        backgroundColor: "#A0522D"
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

  const getFindingStyle = (finding) => {
    const normalKeywords = ["Normal", "pregnancy", "density"]
    return normalKeywords.some(k => finding.toLowerCase().includes(k.toLowerCase()))
      ? "text-success"
      : "text-danger fw-bold"
  }

  return (
    <div>
      <h4>Imaging Reports (Zimbabwe)</h4>
      <p>Uploaded veterinary imaging reports (X-ray, ultrasound, CT, MRI) for cattle, goats, and sheep.</p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "X-Ray", "Ultrasound", "CT Scan", "MRI"].map(type => (
          <button
            key={type}
            className={`btn btn-sm ${typeFilter === type ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Cattle", "Goat", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${speciesFilter === species ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setSpeciesFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      <div className="row mb-3">
        {filteredReports.length > 0 ? filteredReports.map(r => (
          <div key={r.id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{r.animal} — {r.type}</h6>
                <p className={`card-text ${getFindingStyle(r.finding)}`}>{r.finding}</p>
                <small className="text-muted">{r.date}</small>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-muted">No reports found for {typeFilter} in {speciesFilter}.</div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3" style={{ height: "300px" }}>
          <h6>Imaging Type Distribution</h6>
          <Pie data={pieData} options={options} />
        </div>

        <div className="col-md-6 mb-3" style={{ height: "300px" }}>
          <h6>Reports Per Week</h6>
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  )
}
