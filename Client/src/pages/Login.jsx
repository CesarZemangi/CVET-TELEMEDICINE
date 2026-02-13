import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.clear();

      const role = result.role.toLowerCase();

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: result.token,
          role: role,
          name: result.user?.name,
        })
      );

      if (role === "farmer") {
        navigate("/farmerdashboard");
      } else if (role === "vet") {
        navigate("/vetdashboard");
      } else if (role === "admin") {
        navigate("/admindashboard");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.7), rgba(34, 139, 34, 0.5)), url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=2073')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          width: 400,
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center mb-4">
           <h3 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>
            CVET LOGIN
          </h3>
          <p className="text-muted small">Welcome back to CVet Telemedicine</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center border-0" style={{ fontSize: "0.85rem", borderRadius: '10px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-uppercase tracking-wider" style={{ color: "var(--text-dark)", fontSize: '0.7rem' }}>Email Address</label>
            <input
              type="email"
              className="form-control py-2 px-3"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-uppercase tracking-wider" style={{ color: "var(--text-dark)", fontSize: '0.7rem' }}>Password</label>
            <input
              type="password"
              className="form-control py-2 px-3"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
            />
          </div>

          <button
            className="btn w-100 py-2 border-0 shadow-sm text-white"
            style={{ 
              background: "linear-gradient(180deg, #228B22 0%, #1E90FF 100%)", 
              fontWeight: "bold",
              borderRadius: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account?
            <span
              style={{ color: "var(--primary-blue)", fontWeight: "600", cursor: "pointer", marginLeft: 5 }}
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}
