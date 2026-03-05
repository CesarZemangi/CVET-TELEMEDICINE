import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("Missing reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword
      });
      setMessage(res.data?.message || "Password reset successful.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f4f7fb" }}>
      <div className="card shadow-sm border-0 p-4" style={{ width: 420, borderRadius: 14 }}>
        <h4 className="fw-bold mb-2">Reset Password</h4>
        <p className="text-muted small mb-3">Set your new password.</p>
        {message && <div className="alert alert-success py-2">{message}</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
