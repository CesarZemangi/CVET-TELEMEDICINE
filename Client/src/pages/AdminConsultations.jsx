import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminConsultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/consultations");
      const data = res.data?.data || res.data || [];
      setConsultations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching admin consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleViewConsultation = (consultation) => {
    navigate("/admindashboard/cases", {
      state: {
        focusCaseId: consultation?.case_id || consultation?.Case?.id || null
      }
    });
  };

  const handleOpenConversation = (consultation) => {
    const caseId = consultation?.case_id || consultation?.Case?.id;
    navigate("/admindashboard/communication/messages?tab=chats", {
      state: {
        focusCaseId: caseId || null
      }
    });
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Consultations</h4>
        <small className="text-muted">
          View and manage all veterinary consultations
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
                  <th>Description</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : consultations.length > 0 ? consultations.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{c.vet?.name || 'Assigned Vet'}</div>
                    </td>
                    <td>
                      {c.Case ? (
                        `${(c.Case.Animal || c.Case.animal)?.species || 'Animal'} (${(c.Case.Animal || c.Case.animal)?.tag_number || 'N/A'})`
                      ) : `Case #${c.case_id}`}
                    </td>
                    <td className="text-truncate" style={{maxWidth: '150px'}}>{c.Case?.description || 'No description'}</td>
                    <td>
                      <span className={`badge ${c.mode === 'video' ? 'bg-primary' : 'bg-info text-dark'}`}>
                        {c.mode.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleViewConsultation(c)}>View</button>
                      <button className="btn btn-sm btn-primary" onClick={() => handleOpenConversation(c)}>Open Conversation</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No consultations found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
