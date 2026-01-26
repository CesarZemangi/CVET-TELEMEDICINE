import React from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import DashboardSection from "../../components/dashboard/DashboardSection"

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function DiseaseTracking() {
  const metrics = [
    { id: 1, disease: "Foot-and-Mouth", cases: 3, region: "Mashonaland East", coords: [-17.5, 31.6] },
    { id: 2, disease: "Newcastle (Poultry)", cases: 5, region: "Bulawayo", coords: [-20.15, 28.58] },
    { id: 3, disease: "Mastitis (Cattle)", cases: 2, region: "Midlands", coords: [-19.0, 29.8] },
    { id: 4, disease: "Anthrax", cases: 1, region: "Matabeleland South", coords: [-21.0, 28.0] },
    { id: 5, disease: "Tick-borne (Theileriosis)", cases: 4, region: "Manicaland", coords: [-18.9, 32.6] }
  ]

  // Bar chart: disease distribution
  const barData = {
    labels: metrics.map(m => m.disease),
    datasets: [
      {
        label: "Reported Cases",
        data: metrics.map(m => m.cases),
        backgroundColor: ["#A0522D", "#CD853F", "#8B4513", "#D2B48C", "#DEB887"]
      }
    ]
  }

  // Line chart: weekly outbreak trend
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Outbreak Reports",
        data: [2, 4, 3, 1],
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
    <DashboardSection title="Disease Tracking">
      <p className="mb-3">Diagnostic tracking of livestock diseases across Zimbabwe:</p>

      <ul className="list-group mb-3">
        {metrics.map(m => (
          <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{m.disease} • {m.region}</span>
            <small className="text-muted">{m.cases} cases</small>
          </li>
        ))}
      </ul>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Disease Distribution</h6>
        <Bar data={barData} options={options} />
      </div>

      <div className="mb-3" style={{ width: "300px", height: "200px" }}>
        <h6>Weekly Outbreak Trend</h6>
        <Line data={lineData} options={options} />
      </div>

      {/* Interactive Zimbabwe Map */}
      <div className="mb-3" style={{ width: "100%", height: "400px" }}>
        <h6>Zimbabwe Disease Hotspots Map</h6>
        <MapContainer center={[-19.0, 29.8]} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {metrics.map(m => (
            <Marker key={m.id} position={m.coords}>
              <Popup>
                <strong>{m.disease}</strong><br />
                Region: {m.region}<br />
                Cases: {m.cases}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardSection>
  )
}
