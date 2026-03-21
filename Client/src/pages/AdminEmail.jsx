import React, { useEffect, useState } from "react";
import DashboardSection from "../components/dashboard/DashboardSection";
import api from "../services/api";

export default function AdminEmail() {
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ total: 0, total_sent: 0, total_failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/emails", { params: { limit: 100 } });
        setLogs(res.data?.data || res.data || []);
        setTotals(res.data?.totals || {});
      } catch (err) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadEmails();
  }, []);

  return (
    <DashboardSection title="Email Center">
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="small text-muted">Total Emails</div>
              <div className="fs-4 fw-bold">{totals.total || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="small text-muted">Sent</div>
              <div className="fs-4 fw-bold text-success">{totals.total_sent || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="small text-muted">Failed</div>
              <div className="fs-4 fw-bold text-danger">{totals.total_failed || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">To</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th className="pe-4">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No email logs found.</td></tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td className="ps-4">{log.to}</td>
                      <td>{log.subject || "-"}</td>
                      <td>
                        <span className={`badge ${log.status === "sent" ? "bg-success" : "bg-danger"}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="small text-muted">{log.error_message || "-"}</td>
                      <td className="pe-4">{log.created_at ? new Date(log.created_at).toLocaleString() : "-"}</td>
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
