import React, { useState, useEffect } from "react";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";
import { Download, Eye } from "lucide-react";

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/media");
      const mediaData = res.data.data || res.data;
      setMedia(Array.isArray(mediaData) ? mediaData : []);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image")) return "🖼️";
    if (fileType.startsWith("video")) return "🎥";
    if (fileType.startsWith("audio")) return "🎵";
    if (fileType === "application/pdf") return "📄";
    return "📁";
  };

  const isPreviewable = (fileType) => {
    return fileType.startsWith("image/") || fileType === "application/pdf";
  };

  return (
    <DashboardSection title="Media Uploads (View Only)">
      <div className="mb-4">
        <p className="text-muted">Monitor all media files uploaded by veterinarians for their cases</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">File Name</th>
                  <th>Uploaded By Vet</th>
                  <th>Case</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded Date</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                    </td>
                  </tr>
                ) : media.length > 0 ? (
                  media.map(m => (
                    <tr key={m.id}>
                      <td className="ps-4 fw-bold">
                        {getFileIcon(m.file_type)} {m.file_name}
                      </td>
                      <td>{m.Case?.Vet?.User?.name || "Unknown"}</td>
                      <td>{m.Case?.title || `Case #${m.case_id}`}</td>
                      <td>
                        <small className="badge bg-info">{m.file_type}</small>
                      </td>
                      <td>{(m.file_size / 1024 / 1024).toFixed(2)} MB</td>
                      <td>{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="text-end pe-4">
                        <a
                          href={m.file_path}
                          download
                          className="btn btn-sm btn-outline-primary me-2"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {isPreviewable(m.file_type) && (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelectedMedia(m)}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No media files found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0 py-3 text-center">
          <span className="small text-muted">Total: {media.length} files</span>
        </div>
      </div>

      {selectedMedia && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedMedia(null)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedMedia.file_name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMedia(null)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedMedia.file_type.startsWith("image/") && (
                  <img
                    src={selectedMedia.file_path}
                    alt={selectedMedia.file_name}
                    className="img-fluid"
                  />
                )}
                {selectedMedia.file_type === "application/pdf" && (
                  <iframe
                    src={selectedMedia.file_path}
                    style={{ width: "100%", height: "500px" }}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
