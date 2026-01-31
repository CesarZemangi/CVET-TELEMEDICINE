import { useState, useEffect } from "react"
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
  const [outcomes, setOutcomes] = useState({})
  const [summary, setSummary] = useState([])

  useEffect(() => {
    fetch(
      `/api/treatments/stats?species=${speciesFilter}&region=${regionFilter}`
    )
      .then(res => res.json())
      .then(data => {
        setOutcomes(data.outcomes)
        setSummary(data.summary)
      })
      .catch(err => console.error(err))
  }, [speciesFilter, regionFilter])

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
        data: outcomes.data || [],
        backgroundColor: [
          "#17a2b8",
          "#ffc107",
          "#dc3545",
          "#6A5ACD"
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
      <p>
        View treatment outcomes and recovery data across communal and commercial
        farms.
      </p>

      <div className="mb-3 d-flex gap-2">
        {["All", "Cattle", "Goats", "Poultry", "Sheep"].map(species => (
          <button
            key={species}
            className={`btn btn-sm ${
              speciesFilter === species
                ? "btn-brown"
                : "btn-outline-brown"
            }`}
            onClick={() => setSpeciesFilter(species)}
          >
            {species}
          </button>
        ))}
      </div>

      <div className="mb-3 d-flex gap-2">
        {["All", "Mashonaland", "Matabeleland", "Midlands", "Manicaland"].map(
          region => (
            <button
              key={region}
              className={`btn btn-sm ${
                regionFilter === region
                  ? "btn-brown"
                  : "btn-outline-brown"
              }`}
              onClick={() => setRegionFilter(region)}
            >
              {region}
            </button>
          )
        )}
      </div>

      <Pie data={data} options={options} />

      <ul className="mt-3">
        {summary.map(row => (
          <li key={row.label}>
            {row.value}% {row.label}
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
