import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function MedicationHistory() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/treatment/medications");
      const data = res.data.data || res.data;
      setMedications(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching medication history:", err);
      setError("Failed to load medication history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <DashboardSection title="Medication History">
      <p className="text-muted mb-4">
        A complete record of medications administered to your animals by veterinarians.
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
                    <th className="ps-4">Start Date</th>
                    <th>Animal</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>End Date</th>
                    <th>Administered By</th>
                    <th className="pe-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.length > 0 ? (
                    medications.map((med) => (
                      <tr key={med.id}>
                        <td className="ps-4">
                          {new Date(med.start_date).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="fw-medium">{med.Animal?.tag_number}</span>
                          <br />
                          <small className="text-muted">{med.Animal?.species}</small>
                        </td>
                        <td className="fw-bold text-brown">{med.medication_name}</td>
                        <td>{med.dosage}</td>
                        <td>
                          {med.end_date ? new Date(med.end_date).toLocaleDateString() : "-"}
                        </td>
                        <td>Dr. {med.Case?.vet?.User?.name || "Unknown"}</td>
                        <td className="pe-4">
                          <small className="text-wrap" style={{ maxWidth: '200px', display: 'block' }}>
                            {med.notes || "-"}
                          </small>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No medication records found for your animals.
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