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
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function Prescriptions() {
  const prescriptions = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", drug: "Oxytetracycline", category: "Antibiotic", dosage: "10ml IM daily x5", status: "Issued", date: "02 Feb 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", drug: "Albendazole", category: "Antiparasitic", dosage: "5ml oral single dose", status: "Issued", date: "02 Feb 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", drug: "Lasota vaccine", category: "Vaccine", dosage: "1 drop ocular per bird", status: "Issued", date: "02 Feb 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", drug: "Progesterone", category: "Hormone", dosage: "2ml IM weekly x3", status: "Issued", date: "01 Feb 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", drug: "Topical antifungal", category: "Antifungal", dosage: "Apply twice daily x7", status: "Issued", date: "01 Feb 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", drug: "Vitamin B complex", category: "Supplement", dosage: "5ml IM weekly x4", status: "Issued", date: "31 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", drug: "Brucella vaccine", category: "Vaccine", dosage: "2ml SC single dose", status: "Issued", date: "31 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", drug: "Sulfa drugs", category: "Antiparasitic", dosage: "10ml oral daily x3", status: "Issued", date: "30 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", drug: "NSAIDs", category: "Pain Relief", dosage: "3ml IM daily x5", status: "Issued", date: "30 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", drug: "Rabies vaccine", category: "Vaccine", dosage: "2ml IM single dose", status: "Issued", date: "29 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredPrescriptions = prescriptions.filter(p =>
    filter === "All" ? true : p.status === filter
  )

  // Pie chart: distribution by category
  const pieData = {
    labels: ["Antibiotic", "Antiparasitic", "Vaccine", "Hormone", "Antifungal", "Supplement", "Pain Relief"],
    datasets: [
      {
        data: [
          prescriptions.filter(p => p.category === "Antibiotic").length,
          prescriptions.filter(p => p.category === "Antiparasitic").length,
          prescriptions.filter(p => p.category === "Vaccine").length,
          prescriptions.filter(p => p.category === "Hormone").length,
          prescriptions.filter(p => p.category === "Antifungal").length,
          prescriptions.filter(p => p.category === "Supplement").length,
          prescriptions.filter(p => p.category === "Pain Relief").length
        ],
        backgroundColor: ["#A0522D", "#CD853F", "#8B4513", "#D2B48C", "#DEB887", "#2E8B57", "#4682B4"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: weekly prescription trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Prescriptions Issued",
        data: [3, 5, 4, 2],
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

  return (
    <DashboardSection title="Issued Prescriptions">
      <p className="mb-3">Prescriptions issued across Zimbabwean farms:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Issued"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Prescriptions list */}
      <ul className="list-group mb-3">
        {filteredPrescriptions.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{p.farmer} • {p.animal} • {p.drug} • {p.dosage}</span>
            <small className="text-muted">{p.date} — {p.status}</small>
          </li>
        ))}
        {filteredPrescriptions.length === 0 && (
          <li className="list-group-item text-muted">No prescriptions found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Prescription Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Prescription Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
