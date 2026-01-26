import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
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

export default function MedicationSchedule() {
  const [filter, setFilter] = useState("All")

  const schedule = [
    { id: 1, animal: "Cow #A12", medication: "Antibiotic", dosage: "Morning", remaining: "7 days" },
    { id: 2, animal: "Goat #B07", medication: "Vitamin Supplement", dosage: "Evening", remaining: "5 days" },
    { id: 3, animal: "Sheep #C21", medication: "Painkiller", dosage: "Morning", remaining: "3 days" },
    { id: 4, animal: "Cow #A15", medication: "Dewormer", dosage: "Evening", remaining: "10 days" },
    { id: 5, animal: "Goat #B11", medication: "Respiratory Medicine", dosage: "Morning", remaining: "2 days" },
    { id: 6, animal: "Sheep #C09", medication: "Skin Ointment", dosage: "Evening", remaining: "8 days" },
    { id: 7, animal: "Cow #A18", medication: "Nutritional Supplement", dosage: "Morning", remaining: "6 days" },
    { id: 8, animal: "Goat #B14", medication: "Antibiotic", dosage: "Evening", remaining: "4 days" },
    { id: 9, animal: "Sheep #C25", medication: "Anti-parasite", dosage: "Morning", remaining: "9 days" },
    { id: 10, animal: "Cow #A20", medication: "Vitamin Booster", dosage: "Evening", remaining: "12 days" }
  ]

  // Filter logic
  const filteredSchedule = schedule.filter(item =>
    filter === "All" ? true : item.medication.includes(filter)
  )

  // Conditional styling based on remaining days
  const getRemainingClass = (remaining) => {
    const days = parseInt(remaining)
    if (days <= 2) return "text-danger fw-bold"
    if (days <= 7) return "text-warning fw-bold"
    return "text-success fw-bold"
  }

  // Detect expiring medications (≤2 days)
  const expiringSoon = schedule.filter(s => parseInt(s.remaining) <= 2)

  // Pie chart: medication type distribution
  const medicationTypes = [...new Set(schedule.map(s => s.medication))]
  const pieData = {
    labels: medicationTypes,
    datasets: [
      {
        data: medicationTypes.map(type => schedule.filter(s => s.medication === type).length),
        backgroundColor: ["#FF4500", "#A0522D", "#CD853F", "#228B22", "#8B4513", "#D2B48C"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Bar chart: remaining days distribution
  const barData = {
    labels: schedule.map(s => s.animal),
    datasets: [
      {
        label: "Days Remaining",
        data: schedule.map(s => parseInt(s.remaining)),
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

  return (
    <DashboardSection title="Medication Schedule (Zimbabwe)">
      <p>Current medication schedules for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {expiringSoon.length > 0 && (
        <div className="alert alert-danger fw-bold">
          ⚠️ {expiringSoon.length} medication(s) expiring soon (≤2 days). Please review urgently!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...medicationTypes].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      <ul className="list-group">
        {filteredSchedule.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.animal} • {item.medication} • {item.dosage}</span>
            <small className={getRemainingClass(item.remaining)}>{item.remaining} remaining</small>
          </li>
        ))}
        {filteredSchedule.length === 0 && (
          <li className="list-group-item text-muted">No schedules found for {filter}.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Medication Type Distribution</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Remaining Days per Animal</h6>
        <Bar data={barData} options={options} />
      </div>
    </DashboardSection>
  )
}
