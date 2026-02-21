import React, { useState, useEffect } from "react";
import { getAllVetMedia, deleteMedia, getMediaByCaseId } from "./services/vet.media.service";
import { getCases } from "./services/vet.cases.service";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";
import { Trash2, Download } from "lucide-react";

export default function MediaUploads() {
  const [media, setMedia] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mediaData, casesData] = await Promise.all([
        getAllVetMedia(),
        getCases()
      ]);
      setMedia(mediaData || []);
      setCases(casesData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !selectedCaseId) {
      alert("Please select a file and case");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("case_id", selectedCaseId);

      await api.post("/vet/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadFile(null);
      setSelectedCaseId("");
      document.querySelector('input[type="file"]').value = "";
      fetchData();
      alert("File uploaded successfully!");
    } catch (err) {
      alert("Failed to upload file: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteMedia(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete file");
      }
    }
  };

  return (
    <DashboardSection title="Media Uploads">
      <div className="mb-6">
        <p className="text-muted">Upload and manage media files for your cases</p>
      </div>

      <div className="card border-0 shadow-sm mb-6">
        <div className="card-body">
          <h5 className="card-title mb-4">Upload New Media</h5>
          <form onSubmit={handleUpload}>
            <div className="row">
              <div className="col-md-5 mb-3">
                <label className="form-label">Select Case</label>
                <select
                  className="form-select"
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  required
                >
                  <option value="">Choose a case...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5 mb-3">
                <label className="form-label">Select File</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,video/*,audio/*"
                  required
                />
              </div>
              <div className="col-md-2 mb-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Your Media Files</h5>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary"></div>
            </div>
          ) : media.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>File Name</th>
                    <th>Case</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {media.map(m => (
                    <tr key={m.id}>
                      <td className="fw-bold">{m.file_name}</td>
                      <td>{m.Case?.title || `Case #${m.case_id}`}</td>
                      <td><small className="badge bg-info">{m.file_type}</small></td>
                      <td>{(m.file_size / 1024 / 1024).toFixed(2)} MB</td>
                      <td>{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="text-end">
                        <a
                          href={m.file_path}
                          download
                          className="btn btn-sm btn-outline-primary me-2"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(m.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted py-4">No media files uploaded yet.</p>
          )}
        </div>
      </div>
    </DashboardSection>
  );
}
