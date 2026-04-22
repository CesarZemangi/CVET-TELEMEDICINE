import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/adminFarmers.css";

export default function AdminAiMonitoring() {
  const [summary, setSummary] = useState(null);
  const [predictionLogs, setPredictionLogs] = useState([]);
  const [opsLogs, setOpsLogs] = useState([]);
  const [quality, setQuality] = useState(null);
  const [datasetRows, setDatasetRows] = useState([]);
  const [paymentInsights, setPaymentInsights] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [summaryRes, predRes, opsRes, qualityRes, dataRes, paymentRes] = await Promise.allSettled([
        api.get("/admin/ai/summary"),
        api.get("/admin/ai/prediction-logs?limit=50"),
        api.get("/admin/ai/ops-logs?limit=50"),
        api.get("/admin/ai/data-quality"),
        api.get("/admin/ai/dataset-records?limit=30"),
        api.get("/ml/payment-insights")
      ]);

      setSummary(summaryRes.status === "fulfilled" ? summaryRes.value.data : null);
      setPredictionLogs(predRes.status === "fulfilled" && Array.isArray(predRes.value.data?.data) ? predRes.value.data.data : []);
      setOpsLogs(opsRes.status === "fulfilled" && Array.isArray(opsRes.value.data?.data) ? opsRes.value.data.data : []);
      setQuality(qualityRes.status === "fulfilled" ? qualityRes.value.data : null);
      setDatasetRows(dataRes.status === "fulfilled" && Array.isArray(dataRes.value.data?.data) ? dataRes.value.data.data : []);
      setPaymentInsights(paymentRes.status === "fulfilled" ? paymentRes.value.data?.data || null : null);

      if (paymentRes.status === "rejected") {
        console.warn("Payment AI endpoint unavailable:", paymentRes.reason?.response?.data || paymentRes.reason?.message || paymentRes.reason);
      }
    } catch (err) {
      console.error("AI admin dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUploadModel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("model", file);
    setUploading(true);
    setUploadMessage("");
    try {
      const res = await api.post("/admin/ai/model/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadMessage(res.data?.message || "Model uploaded.");
    } catch (err) {
      setUploadMessage(err.response?.data?.error || err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get("/admin/ai/export-cases-csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cases_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  const handleExportPaymentsCsv = async () => {
    try {
      const res = await api.get("/admin/ai/export-payments-csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Payment CSV export failed:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid py-4 af-page">
      <div className="af-hero">
        <div>
          <p className="af-kicker">Model Ops • Live</p>
          <h1 className="af-title">AI Ops Observatory</h1>
          <p className="af-subtitle">Monitor predictions, data quality, and payment-side insights; admin-only oversight.</p>
          <div className="af-pills">
            <span className="af-pill">Predictions • {summary?.total_predictions || 0}</span>
            <span className="af-pill af-pill-emerald">Model • {summary?.model?.model_name || "N/A"}</span>
            <span className="af-pill af-pill-amber">Dataset • {summary?.model?.dataset_size || 0}</span>
          </div>
        </div>
        <div className="af-actions">
          <button className="af-btn-ghost" onClick={handleExportCsv}>Export Cases CSV</button>
          <button className="af-btn-soft" onClick={handleExportPaymentsCsv}>Export Payments CSV</button>
          <label className="af-btn mb-0" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading..." : "Upload Model File"}
            <input type="file" hidden onChange={handleUploadModel} />
          </label>
        </div>
      </div>

      {uploadMessage && <div className="alert alert-info py-2">{uploadMessage}</div>}

      <div className="row g-3 mb-3">
        <div className="col-md-3"><div className="af-card"><div className="af-card-header"><h3>Predictions</h3><span className="af-meta">Total</span></div><div className="p-3"><div className="h4 mb-0">{summary?.total_predictions || 0}</div></div></div></div>
        <div className="col-md-3"><div className="af-card"><div className="af-card-header"><h3>Model</h3><span className="af-meta">Name</span></div><div className="p-3"><div className="h6 mb-0">{summary?.model?.model_name || "N/A"}</div></div></div></div>
        <div className="col-md-3"><div className="af-card"><div className="af-card-header"><h3>Version</h3><span className="af-meta">Model</span></div><div className="p-3"><div className="h6 mb-0">{summary?.model?.model_version || "N/A"}</div></div></div></div>
        <div className="col-md-3"><div className="af-card"><div className="af-card-header"><h3>Dataset</h3><span className="af-meta">Rows</span></div><div className="p-3"><div className="h4 mb-0">{summary?.model?.dataset_size || 0}</div></div></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="af-card">
            <div className="af-card-header"><h3>Most Predicted Diseases</h3></div>
            <div className="af-table-wrapper">
              {(summary?.most_predicted_diseases || []).length === 0 ? (
                <div className="text-muted p-3">No prediction data yet.</div>
              ) : (
                <table className="af-table">
                  <tbody>
                    {summary.most_predicted_diseases.map((row, idx) => (
                      <tr key={`d-${idx}`} className="af-row">
                        <td className="af-cell-strong">{row.predicted_disease}</td>
                        <td className="text-end">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="af-card">
            <div className="af-card-header"><h3>Payment AI Highlights</h3></div>
            <div className="p-3">
              <p className="mb-1">Recommended method: <strong>{paymentInsights?.payment_success?.recommended_method || "N/A"}</strong></p>
              <p className="mb-1">Recommended provider: <strong>{paymentInsights?.payment_success?.recommended_provider || "N/A"}</strong></p>
              <p className="mb-1">Busiest day: <strong>{paymentInsights?.demand_forecast?.busiest_day || "N/A"}</strong></p>
              <p className="mb-0">Next-period consultations: <strong>{paymentInsights?.demand_forecast?.expected_next_period_consultations || 0}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Payment Data Quality</div>
            <div className="card-body">
              <p className="mb-1">Total cases: <strong>{quality?.total_cases || 0}</strong></p>
              <p className="mb-1">Missing symptoms: <strong>{quality?.missing_symptoms || 0}</strong></p>
              <p className="mb-1">Missing description: <strong>{quality?.missing_description || 0}</strong></p>
              <p className="mb-0">Completeness: <strong>{quality?.data_completeness_percent || 0}%</strong></p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Top Payment Methods</div>
            <div className="card-body">
              {(paymentInsights?.payment_success?.by_method || []).length === 0 ? (
                <div className="text-muted">No payment history available.</div>
              ) : (
                <ul className="list-group">
                  {paymentInsights.payment_success.by_method.map((row, idx) => (
                    <li key={`pm-${idx}`} className="list-group-item d-flex justify-content-between">
                      <span>{row.payment_method}</span>
                      <strong>{row.success_probability != null ? `${(Number(row.success_probability) * 100).toFixed(1)}%` : "N/A"}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12">
          <div className="af-card">
            <div className="af-card-header"><h3>Demand Forecast Leaders</h3></div>
            <div className="af-table-wrapper">
              <table className="af-table">
                <thead>
                  <tr><th>Vet</th><th>Consultation Count</th><th>Farmer</th><th>Payment Count</th></tr>
                </thead>
                <tbody>
                  {Math.max(paymentInsights?.demand_forecast?.top_vets?.length || 0, paymentInsights?.demand_forecast?.frequent_farmers?.length || 0) === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No payment demand data available.</td></tr>
                  ) : (
                    Array.from({
                      length: Math.max(paymentInsights?.demand_forecast?.top_vets?.length || 0, paymentInsights?.demand_forecast?.frequent_farmers?.length || 0)
                    }).map((_, idx) => (
                      <tr key={`forecast-${idx}`} className="af-row">
                        <td>{paymentInsights?.demand_forecast?.top_vets?.[idx]?.vet_name || "-"}</td>
                        <td>{paymentInsights?.demand_forecast?.top_vets?.[idx]?.consultation_count || "-"}</td>
                        <td>{paymentInsights?.demand_forecast?.frequent_farmers?.[idx]?.farmer_name || "-"}</td>
                        <td>{paymentInsights?.demand_forecast?.frequent_farmers?.[idx]?.payment_count || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="af-card">
            <div className="af-card-header"><h3>Prediction Logs</h3></div>
            <div className="af-table-wrapper">
              <table className="af-table">
                <thead>
                  <tr><th>ID</th><th>Case</th><th>Vet</th><th>Disease</th><th>Confidence</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {predictionLogs.map((log) => (
                    <tr key={log.id} className="af-row">
                      <td>{log.id}</td>
                      <td>{log.case_id ? `#${log.case_id}` : "N/A"}</td>
                      <td>{log.vet?.User?.name || `Vet#${log.vet_id}`}</td>
                      <td>{log.predicted_disease}</td>
                      <td>{log.confidence != null ? `${(Number(log.confidence) * 100).toFixed(1)}%` : "N/A"}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="af-card">
            <div className="af-card-header"><h3>AI Ops Logs (Errors / Response Time)</h3></div>
            <div className="af-table-wrapper">
              <table className="af-table">
                <thead><tr><th>Time</th><th>Type</th><th>Action</th></tr></thead>
                <tbody>
                  {opsLogs.map((log) => (
                    <tr key={log.id} className="af-row">
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.action_type}</td>
                      <td>{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="af-card">
            <div className="af-card-header"><h3>Training Dataset Records (Preview)</h3></div>
            <div className="af-table-wrapper">
              <table className="af-table">
                <thead><tr><th>ID</th><th>Title</th><th>Symptoms</th><th>Updated</th></tr></thead>
                <tbody>
                  {datasetRows.map((row) => (
                    <tr key={row.id} className="af-row">
                      <td>{row.id}</td>
                      <td>{row.title || "N/A"}</td>
                      <td>{row.symptoms || "N/A"}</td>
                      <td>{row.updated_at ? new Date(row.updated_at).toLocaleString() : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
