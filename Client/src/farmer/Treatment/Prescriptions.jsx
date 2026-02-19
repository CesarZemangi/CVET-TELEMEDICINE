import React, { useState, useEffect } from "react"
import api from "../../services/api"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get("/farmer/treatment/prescriptions");
        setPrescriptions(res.data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  // Doctors distribution
  const doctors = [...new Set(prescriptions.map(p => p.Case?.vet?.name || 'Assigned Vet'))]
  const pieData = {
    labels: doctors,
    datasets: [
      {
        data: doctors.map(doc => prescriptions.filter(p => (p.Case?.vet?.name || 'Assigned Vet') === doc).length),
        backgroundColor: ["#FF4500", "#1E90FF", "#228B22", "#8B4513", "#A0522D", "#CD853F"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  }

  return (
    <DashboardSection title="Prescriptions">
      <p>View prescriptions issued by veterinarians for your livestock.</p>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {/* Prescriptions list */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Animal</th>
                    <th>Medication</th>
                    <th>Vet</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length > 0 ? prescriptions.map(p => (
                    <tr key={p.id}>
                      <td>{p.Case?.Animal?.species} ({p.Case?.Animal?.tag_number})</td>
                      <td className="fw-bold">{p.medicine}</td>
                      <td>{p.Case?.vet?.name || 'N/A'}</td>
                      <td className="text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center py-4">No prescriptions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          {prescriptions.length > 0 && (
            <div className="row">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-3 h-100">
                  <h6 className="fw-bold mb-3">Prescriptions by Doctor</h6>
                  <div style={{ height: "250px" }}>
                    <Pie data={pieData} options={{ ...options, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardSection>
  )
}
