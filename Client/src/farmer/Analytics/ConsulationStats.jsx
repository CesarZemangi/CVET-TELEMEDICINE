import DashboardSection from "../../components/dashboard/DashboardSection";

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
  const data = {
    labels: [
      "Completed",
      "Pending Review",
      "Cancelled",
      "Upcoming",
      "With Lab Tests",
      "With Surgery",
      "Avg Duration",
      "Satisfaction"
    ],
    datasets: [
      {
        label: "Consultations (Zimbabwe)",
        data: [22, 7, 2, 12, 6, 3, 50, 88], // localized sample values
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
    labels: ["Cattle", "Goats", "Poultry", "Sheep"],
    datasets: [
      {
        label: "Consultations by Species",
        data: [15, 10, 8, 5], // sample localized values
        backgroundColor: ["#17a2b8", "#ffc107", "#28a745", "#dc3545"]
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Zimbabwe Veterinary Consultation Statistics Overview" }
    }
  }

  return (
    <DashboardSection title="Consultation Statistics (Zimbabwe)">
      {/* Overall consultation stats */}
      <Bar data={data} options={options} />

      {/* Species breakdown */}
      <div className="mt-4">
        <h6>Consultations by Species</h6>
        <Bar data={speciesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <ul className="mt-3">
        <li>22 consultations completed this month across Mashonaland and Matabeleland farms</li>
        <li>7 consultations pending review by district veterinary officers</li>
        <li>2 consultations cancelled due to farmer travel or resource constraints</li>
        <li>12 consultations scheduled for next week (mostly cattle and goat herds)</li>
        <li>Average duration: 50 minutes per consultation</li>
        <li>Most common issue: Mastitis in dairy cows (9 cases)</li>
        <li>6 consultations included lab tests (blood chemistry, fecal exams)</li>
        <li>3 consultations required surgical follow-up (fracture fixation, abscess drainage)</li>
        <li>Farmer satisfaction rating: 88% (based on Midlands and Manicaland feedback)</li>
        <li>Species breakdown: 15 cattle, 10 goats, 8 poultry, 5 sheep consultations</li>
      </ul>
    </DashboardSection>
  )
}
