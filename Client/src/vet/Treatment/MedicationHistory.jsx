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

export default function MedicationHistory() {
  const medications = [
    { id: 1, farmer: "Tendai Moyo", animal: "Nguni Cow #A12", drug: "Oxytetracycline", category: "Antibiotic", purpose: "Mastitis treatment", status: "Completed", date: "02 Jan 2026" },
    { id: 2, farmer: "Rudo Chikafu", animal: "Matabele Goat #B07", drug: "Albendazole", category: "Antiparasitic", purpose: "Deworming", status: "Completed", date: "03 Jan 2026" },
    { id: 3, farmer: "Blessing Ncube", animal: "Indigenous Chicken Flock", drug: "Lasota vaccine", category: "Vaccine", purpose: "Newcastle prevention", status: "Completed", date: "04 Jan 2026" },
    { id: 4, farmer: "Tatenda Dube", animal: "Nguni Cow #A15", drug: "Progesterone", category: "Hormone", purpose: "Fertility therapy", status: "In Progress", date: "05 Jan 2026" },
    { id: 5, farmer: "Nyasha Sibanda", animal: "Goat #B11", drug: "Topical antifungal", category: "Antifungal", purpose: "Dermatitis", status: "Completed", date: "06 Jan 2026" },
    { id: 6, farmer: "Chipo Mutasa", animal: "Sheep #C09", drug: "Vitamin B complex", category: "Supplement", purpose: "Nutritional support", status: "Completed", date: "07 Jan 2026" },
    { id: 7, farmer: "Tafadzwa Mhlanga", animal: "Nguni Cow #A18", drug: "Brucella vaccine", category: "Vaccine", purpose: "Brucellosis prevention", status: "Scheduled", date: "08 Jan 2026" },
    { id: 8, farmer: "Kudakwashe Dlamini", animal: "Goat #B14", drug: "Sulfa drugs", category: "Antiparasitic", purpose: "Coccidiosis treatment", status: "In Progress", date: "09 Jan 2026" },
    { id: 9, farmer: "Ropafadzo Nkomo", animal: "Sheep #C25", drug: "NSAIDs", category: "Pain Relief", purpose: "Joint pain management", status: "Completed", date: "10 Jan 2026" },
    { id: 10, farmer: "Simba Chirwa", animal: "Nguni Cow #A20", drug: "Rabies vaccine", category: "Vaccine", purpose: "Rabies prevention", status: "Completed", date: "11 Jan 2026" }
  ]

  const [filter, setFilter] = useState("All")

  const filteredMedications = medications.filter(m =>
    filter === "All" ? true : m.status === filter
  )

  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled": return "badge bg-info text-dark"
      case "In Progress": return "badge bg-warning text-dark"
      case "Completed": return "badge bg-success"
      default: return "badge bg-secondary"
    }
  }

  // Pie chart: distribution by category
  const pieData = {
    labels: ["Antibiotic", "Antiparasitic", "Vaccine", "Hormone", "Antifungal", "Supplement", "Pain Relief"],
    datasets: [
      {
        data: [
          medications.filter(m => m.category === "Antibiotic").length,
          medications.filter(m => m.category === "Antiparasitic").length,
          medications.filter(m => m.category === "Vaccine").length,
          medications.filter(m => m.category === "Hormone").length,
          medications.filter(m => m.category === "Antifungal").length,
          medications.filter(m => m.category === "Supplement").length,
          medications.filter(m => m.category === "Pain Relief").length
        ],
        backgroundColor: ["#A0522D", "#CD853F", "#8B4513", "#D2B48C", "#DEB887", "#2E8B57", "#4682B4"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Line chart: weekly medication trend (example data)
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Medications Administered",
        data: [3, 4, 2, 5],
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
    <DashboardSection title="Medication History">
      <p className="mb-3">Medication records across Zimbabwean farms:</p>

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2">
        {["All", "Scheduled", "In Progress", "Completed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Medication list */}
      <ul className="list-group mb-3">
        {filteredMedications.map(m => (
          <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{m.farmer} • {m.animal} • {m.drug} • {m.purpose}</span>
            <div>
              <span className={getStatusClass(m.status)}>{m.status}</span>
              <small className="text-muted ms-2">{m.date}</small>
            </div>
          </li>
        ))}
        {filteredMedications.length === 0 && (
          <li className="list-group-item text-muted">No medication records found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mb-3" style={{ width: "250px", height: "250px" }}>
        <h6>Medication Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Medication Trend</h6>
        <Line data={lineData} options={options} />
      </div>
    </DashboardSection>
  )
}
