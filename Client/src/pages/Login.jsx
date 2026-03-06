import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const apkDownloadUrl = import.meta.env.VITE_APK_DOWNLOAD_URL || "/downloads/cvet-telemedicine.apk";
  const [showApkDownload, setShowApkDownload] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setEmail("");
          setPassword("");
        }
        throw new Error(result.message || "Login failed");
      }

      localStorage.clear();

      const role = result.role.toLowerCase();

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.user?.id,
          token: result.token,
          role: role,
          name: result.user?.name,
          profile_image: result.user?.profile_image
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
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control py-2 px-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: '10px', border: '1px solid #e0e0e0', paddingRight: '40px' }}
              />
              <button
                type="button"
                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-end mt-2">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none small"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
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
        <div className="mt-3 rounded-3 border" style={{ borderColor: "#d9f2dd", overflow: "hidden" }}>
          <button
            type="button"
            className="w-100 d-flex align-items-center justify-content-between border-0 px-3 py-2"
            style={{ backgroundColor: "#f8fff8", color: "#2d5a2d", fontSize: "0.82rem", fontWeight: 600 }}
            onClick={() => setShowApkDownload((prev) => !prev)}
          >
            <span>Get CVET Android App</span>
            <span style={{ fontSize: "0.72rem", lineHeight: 1 }}>▼</span>
          </button>
          {showApkDownload && (
            <div className="px-3 pt-2 pb-3 border-top" style={{ backgroundColor: "#ffffff", borderColor: "#e9f7eb" }}>
              <p className="mb-2" style={{ color: "#2d5a2d", fontSize: "0.78rem", lineHeight: 1.35 }}>
                Bring CVET to the farm. Download the Android app for faster field access to cases, appointments, and consultations.
              </p>
              <a
                href={apkDownloadUrl}
                className="btn btn-sm w-100 text-white fw-semibold py-1"
                style={{ background: "linear-gradient(180deg, #2e8b57 0%, #1e90ff 100%)", fontSize: "0.78rem" }}
                download
              >
                Download CVET Android App (.apk)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
