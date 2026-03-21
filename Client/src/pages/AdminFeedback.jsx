import React, { useEffect, useState } from "react";
import DashboardSection from "../components/dashboard/DashboardSection";
import api from "../services/api";

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/feedback");
        const list = res.data?.data || res.data || [];
        setFeedback(Array.isArray(list) ? list : []);
      } catch (err) {
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  return (
    <DashboardSection title="Feedback Inbox">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Farmer</th>
                  <th>Vet</th>
                  <th>Case</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th className="pe-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : feedback.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No feedback found.</td></tr>
                ) : (
                  feedback.map((f) => (
                    <tr key={f.id}>
                      <td className="ps-4">{f.farmer?.name || "Farmer"} <div className="small text-muted">{f.farmer?.email}</div></td>
                      <td>{f.vet?.User?.name || "Vet"} <div className="small text-muted">{f.vet?.User?.email}</div></td>
                      <td>#{f.case_id}</td>
                      <td>
                        <span className="badge bg-warning text-dark">{f.rating}/5</span>
                      </td>
                      <td>{f.comments}</td>
                      <td className="pe-4">{f.created_at ? new Date(f.created_at).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
