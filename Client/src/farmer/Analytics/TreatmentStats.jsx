import React, { useState } from "react"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TreatmentStats() {
  const [speciesFilter, setSpeciesFilter] = useState("All")
  const [regionFilter, setRegionFilter] = useState("All")

  const outcomes = {
    "All": { data: [72, 18, 7, 3] },
    "Cattle": { data: [75, 15, 7, 3] },
    "Goats": { data: [70, 20, 8, 2] },
    "Poultry": { data: [68, 22, 7, 3] },
    "Sheep": { data: [73, 17, 6, 4] }
  }

  const data = {
    labels: [
      "Successful Recoveries",
      "Ongoing Treatments",
      "Complications",
      "Failed Treatments"
    ],
    datasets: [
      {
        label: `Treatment Outcomes (${speciesFilter}, ${regionFilter})`,
        data: outcomes[speciesFilter].data,
        backgroundColor: [
          "#17a2b8", // recoveries
          "#ffc107", // ongoing
          "#dc3545", // complications
          "#6A5ACD"  // failed
        ],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: `Zimbabwe Veterinary Treatment Outcomes (${speciesFilter}, ${regionFilter})`
      }
    }
  }

  return (
    <DashboardSection title="Treatment Statistics (Zimbabwe)">
      <p>View treatment outcomes and recovery data across communal and commercial farms.</p>

      {/* Species filter */}
      <div className="mb-3 d-flex gap-2">
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

      {/* Region filter */}
      <div className="mb-3 d-flex gap-2">
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

      <Pie data={data} options={options} />

      <ul className="mt-3">
        <li>{outcomes[speciesFilter].data[0]}% of cases showed successful recoveries.</li>
        <li>{outcomes[speciesFilter].data[1]}% are ongoing treatments.</li>
        <li>{outcomes[speciesFilter].data[2]}% faced complications.</li>
        <li>{outcomes[speciesFilter].data[3]}% failed treatments.</li>
      </ul>
    </DashboardSection>
  )
}
