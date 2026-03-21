import React, { useState, useEffect } from "react";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";

export default function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/admin/profile", profile);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardSection title="Admin Settings">
      <div
        className="rounded-4 shadow-lg border border-0"
        style={{
          background: "linear-gradient(135deg, #f4f6fb 0%, #eef1f8 50%, #f8fafc 100%)",
          padding: "2rem",
        }}
      >
        <form onSubmit={handleSave} className="mx-auto" style={{ maxWidth: "600px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1 fw-bold text-dark">Account Profile</h5>
              <small className="text-muted">Update your admin contact details</small>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-3 mb-3 ${message.includes("successfully") ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}
            >
              {message}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-muted">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              placeholder="+1 555 555 5555"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg px-4 shadow-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardSection>
  );
}
