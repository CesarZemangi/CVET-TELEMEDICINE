import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFarmerConsultations } from "../services/consultation";

export default function Consultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getFarmerConsultations();
      setConsultations(data?.data || data || []);
    } catch (err) {
      console.error("Error fetching farmer consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const getVetName = (consultation) =>
    consultation?.vet?.User?.name ||
    consultation?.vet?.name ||
    consultation?.Case?.vet?.User?.name ||
    consultation?.Case?.vet?.name ||
    "Assigned Vet";

  const handleJoinConsultation = (consultation) => {
    const mode = String(consultation?.mode || "").toLowerCase();
    const caseId = consultation?.case_id || consultation?.Case?.id;

    if (mode === "video") {
      const roomKey = consultation?.id || caseId;
      if (!roomKey) {
        alert("Unable to open video session: consultation reference missing.");
        return;
      }
      const url = `https://meet.jit.si/cvet-consult-${encodeURIComponent(roomKey)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    const vetUserId = consultation?.vet?.User?.id || consultation?.Case?.vet?.User?.id || consultation?.Case?.vet?.user_id;
    const vetName = getVetName(consultation);
    if (!vetUserId) {
      alert("Unable to open chat: veterinarian account not found.");
      return;
    }

    navigate("/farmerdashboard/communication/messages", {
      state: {
        initialPartner: { id: vetUserId, name: vetName, role: "vet" },
        initialCaseId: caseId || null
      }
    });
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Consultations</h4>
        <small className="text-muted">
          View and manage your veterinary consultations
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Veterinarian</th>
                  <th>Animal</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : consultations.length > 0 ? consultations.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{getVetName(c)}</div>
                    </td>
                    <td>{c.Case?.Animal?.species || 'N/A'} ({c.Case?.Animal?.tag_number || 'N/A'})</td>
                    <td>
                      <span className={`badge ${c.mode === 'video' ? 'bg-primary' : 'bg-info text-dark'}`}>
                        {(c.mode || 'N/A').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-primary" onClick={() => handleJoinConsultation(c)}>Join</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No consultations found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
