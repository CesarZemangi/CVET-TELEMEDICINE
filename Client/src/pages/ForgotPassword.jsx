import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devResetLink, setDevResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setDevResetLink("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data?.message || "Check your email for reset instructions.");
      if (res.data?.dev_reset_link) {
        setDevResetLink(res.data.dev_reset_link);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f4f7fb" }}>
      <div className="card shadow-sm border-0 p-4" style={{ width: 420, borderRadius: 14 }}>
        <h4 className="fw-bold mb-2">Forgot Password</h4>
        <p className="text-muted small mb-3">Enter your email to receive a reset link.</p>
        {message && <div className="alert alert-success py-2">{message}</div>}
        {devResetLink && (
          <div className="alert alert-info py-2">
            Dev reset link: <a href={devResetLink}>{devResetLink}</a>
          </div>
        )}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <button className="btn btn-link mt-3 p-0 text-decoration-none" onClick={() => navigate("/")}>
          Back to login
        </button>
      </div>
    </div>
  );
}
