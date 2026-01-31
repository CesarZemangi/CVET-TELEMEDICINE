import React, { useEffect, useState } from "react";
import DashboardSection from "../../components/dashboard/DashboardSection";
import { Pie, Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function Screenings() {
  const [screenings, setScreenings] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/farmer/screenings")
      .then(res => res.json())
      .then(data => setScreenings(data))
      .catch(err => console.error(err));
  }, []);

  const filteredScreenings = screenings.filter(s => filter === "All" ? true : s.status === filter);

  const pieData = {
    labels: ["Scheduled", "Completed"],
    datasets: [{
      data: [
        screenings.filter(s => s.status === "Scheduled").length,
        screenings.filter(s => s.status === "Completed").length
      ],
      backgroundColor: ["#1E90FF","#228B22"],
      borderColor: "#fff",
      borderWidth: 2
    }]
  };

  const lineData = {
    labels: screenings.map(s => s.date),
    datasets: [
      {
        label: "Scheduled",
        data: screenings.map(s => s.status === "Scheduled" ? 1 : 0),
        borderColor: "#1E90FF",
        backgroundColor: "#87CEFA",
        tension: 0.3,
        fill: true
      },
      {
        label: "Completed",
        data: screenings.map(s => s.status === "Completed" ? 1 : 0),
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = { responsive: true, plugins: { legend: { position: "bottom" }, title: { display: true } } };

  return (
    <DashboardSection title="Preventive Screenings">
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All","Scheduled","Completed"].map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?"btn-brown":"btn-outline-brown"}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      <ul className="list-group mb-3">
        {filteredScreenings.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.type}</span>
            <small className="text-muted">{s.date} — {s.status}</small>
          </li>
        ))}
        {filteredScreenings.length===0 && <li className="list-group-item text-muted">No {filter.toLowerCase()} screenings found.</li>}
      </ul>

      <div className="mb-4" style={{width:"300px",height:"250px"}}><h6>Summary</h6><Pie data={pieData} options={options} /></div>
      <div className="mb-4" style={{width:"500px",height:"300px"}}><h6>Timeline</h6><Line data={lineData} options={options} /></div>
    </DashboardSection>
  );
}
