import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function ReportsExport() {
  const [regionFilter, setRegionFilter] = useState("All")
  const [speciesFilter, setSpeciesFilter] = useState("All")
  const [reports, setReports] = useState([])
  const [formats, setFormats] = useState([])

  useEffect(() => {
    fetch("/api/reports/metadata")
      .then(res => res.json())
      .then(data => {
        setReports(data.reports)
        setFormats(data.formats)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <DashboardSection title="Reports Export (Zimbabwe)">
      <p>Select a format to export your farm and veterinary reports.</p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {formats.map(format => (
          <button
            key={format}
            className="btn btn-outline-brown"
            onClick={() =>
              fetch(
                `/api/reports/export?format=${format}&region=${regionFilter}&species=${speciesFilter}`
              )
            }
          >
            Export {format}
          </button>
        ))}
      </div>

      <h6 className="fw-semibold mt-3">Filter by Region</h6>
      <div className="d-flex gap-2 mb-3">
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

      <h6 className="fw-semibold mt-3">Filter by Species</h6>
      <div className="d-flex gap-2 mb-3">
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

      <h6 className="fw-semibold mt-3">Available Reports</h6>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            {report.name} ({regionFilter}, {speciesFilter})
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
