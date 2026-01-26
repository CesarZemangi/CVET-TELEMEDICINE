import React from "react"
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function TreatmentEffectiveness() {
  // Bar chart: effectiveness metrics
  const barData = {
    labels: [
      "Recovery Rate",
      "Recovery Time",
      "Adherence",
      "Recurrence Reduction",
      "Vaccination",
      "Complications",
      "Follow-up",
      "Nutrition Impact",
      "Antibiotic Reduction",
      "Satisfaction"
    ],
    datasets: [
      {
        label: "Effectiveness Metrics (%)",
        data: [86, 22, 94, 18, 91, 97, 88, 15, 12, 93], // localized sample values
        backgroundColor: [
          "#17a2b8",
          "#ffc107",
          "#28a745",
          "#8B4513",
          "#A0522D",
          "#dc3545",
          "#2E8B57",
          "#4682B4",
          "#6A5ACD",
          "#CD853F"
        ]
      }
    ]
  }

  // Line chart: quarterly treatment success trend (example data)
  const lineData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Treatment Success Score",
        data: [72, 78, 84, 89],
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
    <DashboardSection title="Treatment Effectiveness (Zimbabwe)">
      <p className="mb-3">Key treatment effectiveness indicators across Zimbabwean farms:</p>

      {/* Bar chart */}
      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Effectiveness Metrics by Category</h6>
        <Bar data={barData} options={options} />
      </div>

      {/* Line chart */}
      <div className="mb-3" style={{ width: "450px", height: "250px" }}>
        <h6>Quarterly Treatment Success Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      {/* Narrative summary */}
      <ul className="mt-3">
        <li>Recovery success rate at 86% across treatments in Mashonaland and Matabeleland herds.</li>
        <li>Average recovery time reduced by 22% compared to last quarter, especially in dairy cows treated for mastitis.</li>
        <li>Medication adherence among communal farmers reached 94%, supported by district veterinary extension officers.</li>
        <li>Preventive treatments lowered disease recurrence by 18%, notably in goat flocks affected by PPR.</li>
        <li>Vaccination effectiveness recorded at 91% coverage, with strong uptake for Newcastle in poultry and rabies in cattle.</li>
        <li>Complication rate dropped to 3%, the lowest in 12 months, especially in surgical cases like abscess drainage.</li>
        <li>Follow-up compliance improved to 88% of scheduled visits, aided by mobile vet services in rural areas.</li>
        <li>Nutrition-based interventions boosted recovery speed by 15%, using sorghum stover and maize silage as feed supplements.</li>
        <li>Antibiotic usage reduced by 12% due to alternative therapies like herbal remedies and improved hygiene practices.</li>
        <li>Farmer satisfaction with treatments at 93% positive feedback, based on surveys in Midlands and Manicaland districts.</li>
      </ul>
    </DashboardSection>
  )
}
