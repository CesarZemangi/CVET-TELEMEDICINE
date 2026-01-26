import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
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
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function Prescriptions() {
  const [filter, setFilter] = useState("All")

  const prescriptions = [
    { id: 1, animal: "Cow #A12", medication: "Antibiotic Course", prescribedBy: "Dr. Kumar", date: "12 Jan 2026" },
    { id: 2, animal: "Goat #B07", medication: "Vitamin Supplement", prescribedBy: "Dr. Rao", date: "14 Jan 2026" },
    { id: 3, animal: "Sheep #C21", medication: "Painkiller", prescribedBy: "Dr. Meena", date: "16 Jan 2026" },
    { id: 4, animal: "Cow #A15", medication: "Dewormer", prescribedBy: "Dr. Patel", date: "18 Jan 2026" },
    { id: 5, animal: "Goat #B11", medication: "Respiratory Medicine", prescribedBy: "Dr. Sharma", date: "20 Jan 2026" },
    { id: 6, animal: "Sheep #C09", medication: "Skin Ointment", prescribedBy: "Dr. Joseph", date: "22 Jan 2026" },
    { id: 7, animal: "Cow #A18", medication: "Nutritional Supplement", prescribedBy: "Dr. Gupta", date: "24 Jan 2026" },
    { id: 8, animal: "Goat #B14", medication: "Antibiotic Course", prescribedBy: "Dr. Kumar", date: "26 Jan 2026" },
    { id: 9, animal: "Sheep #C25", medication: "Anti-parasite Treatment", prescribedBy: "Dr. Rao", date: "28 Jan 2026" },
    { id: 10, animal: "Cow #A20", medication: "Vitamin Booster", prescribedBy: "Dr. Meena", date: "30 Jan 2026" }
  ]

  const filteredPrescriptions = prescriptions.filter(p =>
    filter === "All" ? true : p.prescribedBy === filter
  )

  const getMedicationClass = (medication) => {
    if (medication.includes("Antibiotic") || medication.includes("Anti-parasite")) return "text-danger fw-bold"
    if (medication.includes("Vitamin") || medication.includes("Supplement")) return "text-success fw-bold"
    return ""
  }

  // Doctors distribution
  const doctors = [...new Set(prescriptions.map(p => p.prescribedBy))]
  const pieData = {
    labels: doctors,
    datasets: [
      {
        data: doctors.map(doc => prescriptions.filter(p => p.prescribedBy === doc).length),
        backgroundColor: ["#FF4500", "#1E90FF", "#228B22", "#8B4513", "#A0522D", "#CD853F"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Medication type distribution
  const meds = [...new Set(prescriptions.map(p => p.medication))]
  const barData = {
    labels: meds,
    datasets: [
      {
        label: "Count",
        data: meds.map(m => prescriptions.filter(p => p.medication === m).length),
        backgroundColor: "#A0522D"
      }
    ]
  }

  // Timeline chart: prescriptions over time
  const lineData = {
    labels: prescriptions.map(p => p.date),
    datasets: [
      {
        label: "Prescriptions",
        data: prescriptions.map(() => 1),
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
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

  const topDoctor = doctors.find(doc =>
    prescriptions.filter(p => p.prescribedBy === doc).length / prescriptions.length > 0.4
  )

  return (
    <DashboardSection title="Prescriptions (Zimbabwe)">
      <p>Recent prescriptions for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {topDoctor && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {topDoctor} has prescribed more than 40% of total prescriptions. Review for balance.
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...doctors].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Prescriptions list */}
      <ul className="list-group">
        {filteredPrescriptions.map(prescription => (
          <li key={prescription.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {prescription.animal} • <span className={getMedicationClass(prescription.medication)}>{prescription.medication}</span> • {prescription.prescribedBy}
            </span>
            <small className="text-muted">{prescription.date}</small>
          </li>
        ))}
        {filteredPrescriptions.length === 0 && (
          <li className="list-group-item text-muted">No prescriptions found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Prescriptions by Doctor</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Prescriptions by Medication Type</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Prescription Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Prescriptions Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
