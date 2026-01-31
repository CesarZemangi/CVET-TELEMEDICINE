import React, { useEffect, useState } from "react";
import DashboardSection from "../../components/dashboard/DashboardSection";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function Vaccinations() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/farmer/vaccinations")
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error(err));
  }, []);

  const filteredRecords = records.filter(r => filter==="All"?true:r.species===filter);
  const vaccineTypes = [...new Set(records.map(r=>r.vaccine))];

  const pieData = {
    labels: ["Cattle","Goat","Sheep"],
    datasets:[{data:[records.filter(r=>r.species==="Cattle").length,records.filter(r=>r.species==="Goat").length,records.filter(r=>r.species==="Sheep").length],backgroundColor:["#8B4513","#A0522D","#CD853F"],borderColor:"#fff",borderWidth:2}]
  };

  const lineData = { labels: records.map(r=>r.date), datasets:[{label:"Vaccinations",data:records.map(()=>1),borderColor:"#228B22",backgroundColor:"#90EE90",tension:0.3,fill:true}]};
  const barData = { labels:vaccineTypes,datasets:[{label:"Count",data:vaccineTypes.map(v=>records.filter(r=>r.vaccine===v).length),backgroundColor:"#A0522D"}]};

  const options = { responsive:true, plugins:{legend:{position:"bottom"},title:{display:true}}};

  return (
    <DashboardSection title="Vaccination Records">
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All","Cattle","Goat","Sheep"].map(f=><button key={f} className={`btn btn-sm ${filter===f?"btn-brown":"btn-outline-brown"}`} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>

      <ul className="list-group mb-3">
        {filteredRecords.map(r=><li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">{r.animal} • {r.vaccine}<small className="text-muted">{r.date}</small></li>)}
        {filteredRecords.length===0 && <li className="list-group-item text-muted">No records found for {filter}.</li>}
      </ul>

      <div className="mb-4" style={{width:"300px",height:"250px"}}><h6>Species Distribution</h6><Pie data={pieData} options={options} /></div>
      <div className="mb-4" style={{width:"500px",height:"300px"}}><h6>Vaccination Timeline</h6><Line data={lineData} options={options} /></div>
      <div className="mb-4" style={{width:"500px",height:"300px"}}><h6>Vaccine Type Breakdown</h6><Bar data={barData} options={options} /></div>
    </DashboardSection>
  );
}
