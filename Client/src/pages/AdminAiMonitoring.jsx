import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminAiMonitoring() {
  const [summary, setSummary] = useState(null);
  const [predictionLogs, setPredictionLogs] = useState([]);
  const [opsLogs, setOpsLogs] = useState([]);
  const [quality, setQuality] = useState(null);
  const [datasetRows, setDatasetRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [summaryRes, predRes, opsRes, qualityRes, dataRes] = await Promise.all([
        api.get("/admin/ai/summary"),
        api.get("/admin/ai/prediction-logs?limit=50"),
        api.get("/admin/ai/ops-logs?limit=50"),
        api.get("/admin/ai/data-quality"),
        api.get("/admin/ai/dataset-records?limit=30")
      ]);

      setSummary(summaryRes.data);
      setPredictionLogs(Array.isArray(predRes.data?.data) ? predRes.data.data : []);
      setOpsLogs(Array.isArray(opsRes.data?.data) ? opsRes.data.data : []);
      setQuality(qualityRes.data);
      setDatasetRows(Array.isArray(dataRes.data?.data) ? dataRes.data.data : []);
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

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">AI Usage Dashboard</h4>
          <small className="text-muted">Monitoring and governance only. Admin cannot run diagnosis predictions.</small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleExportCsv}>Export Cases CSV</button>
          <label className="btn btn-primary mb-0">
            {uploading ? "Uploading..." : "Upload Model File"}
            <input type="file" hidden onChange={handleUploadModel} />
          </label>
        </div>
      </div>

      {uploadMessage && <div className="alert alert-info py-2">{uploadMessage}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card border-0 shadow-sm p-3"><div className="small text-muted">Total Predictions</div><div className="h4 mb-0">{summary?.total_predictions || 0}</div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm p-3"><div className="small text-muted">Model Name</div><div className="h6 mb-0">{summary?.model?.model_name || "N/A"}</div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm p-3"><div className="small text-muted">Model Version</div><div className="h6 mb-0">{summary?.model?.model_version || "N/A"}</div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm p-3"><div className="small text-muted">Dataset Size</div><div className="h4 mb-0">{summary?.model?.dataset_size || 0}</div></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Most Predicted Diseases</div>
            <div className="card-body">
              {(summary?.most_predicted_diseases || []).length === 0 ? (
                <div className="text-muted">No prediction data yet.</div>
              ) : (
                <ul className="list-group">
                  {summary.most_predicted_diseases.map((row, idx) => (
                    <li className="list-group-item d-flex justify-content-between" key={`d-${idx}`}>
                      <span>{row.predicted_disease}</span>
                      <strong>{row.count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Data Quality</div>
            <div className="card-body">
              <p className="mb-1">Total cases: <strong>{quality?.total_cases || 0}</strong></p>
              <p className="mb-1">Missing symptoms: <strong>{quality?.missing_symptoms || 0}</strong></p>
              <p className="mb-1">Missing description: <strong>{quality?.missing_description || 0}</strong></p>
              <p className="mb-0">Completeness: <strong>{quality?.data_completeness_percent || 0}%</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Prediction Logs</div>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr><th>ID</th><th>Case</th><th>Vet</th><th>Disease</th><th>Confidence</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {predictionLogs.map((log) => (
                    <tr key={log.id}>
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
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">AI Ops Logs (Errors / Response Time)</div>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead className="table-light"><tr><th>Time</th><th>Type</th><th>Action</th></tr></thead>
                <tbody>
                  {opsLogs.map((log) => (
                    <tr key={log.id}>
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
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Training Dataset Records (Preview)</div>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead className="table-light"><tr><th>ID</th><th>Title</th><th>Symptoms</th><th>Updated</th></tr></thead>
                <tbody>
                  {datasetRows.map((row) => (
                    <tr key={row.id}>
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
