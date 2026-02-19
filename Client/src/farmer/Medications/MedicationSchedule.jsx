import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function MedicationSchedule() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/treatment/prescriptions");
      setPrescriptions(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching medication schedule:", err);
      setError("Failed to load medication schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <DashboardSection title="Active Medication Schedule">
      <p className="text-muted mb-4">
        Follow the prescribed medication schedule for your animals as directed by your veterinarian.
      </p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Animal</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Prescribed By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length > 0 ? (
                    prescriptions.map((p) => (
                      <tr key={p.id}>
                        <td className="ps-3">
                          <span className="fw-medium">{p.Case?.Animal?.tag_number}</span>
                          <br />
                          <small className="text-muted">{p.Case?.Animal?.species}</small>
                        </td>
                        <td className="fw-bold text-brown">{p.medicine}</td>
                        <td>{p.dosage}</td>
                        <td>{p.duration}</td>
                        <td>Dr. {p.Case?.vet?.name || "Unknown"}</td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No active medication schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}