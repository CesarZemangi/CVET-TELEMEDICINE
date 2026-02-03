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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse JSON immediately so we can read error messages from the backend
      const result = await res.json();

      if (!res.ok) {
        // If the backend sent a specific message (e.g., "Invalid password"), use it
        throw new Error(result.message || "Login failed");
      }

      // 1. Save the response to localStorage
      localStorage.setItem("user", JSON.stringify(result));

      // 2. Identify role (checking both flat structure and nested 'data' structure)
      const userData = result.data || result;
      const userRole = userData.role;

      // 3. Navigate based on role
      if (userRole === "farmer") {
        navigate("/farmer");
      } else if (userRole === "vet") {
        navigate("/vet");
      } else {
        setError("User role not recognized. Please contact support.");
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#F5F5DC" }}>
      <div
        className="card p-4 shadow"
        style={{
          width: 380,
          borderRadius: "12px",
          backgroundColor: "#fff",
          border: "1px solid #A0522D"
        }}
      >
        <h4 className="text-center fw-bold mb-4" style={{ color: "#A0522D" }}>
          CVET Login
        </h4>

        {error && (
          <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: "#A0522D" }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: "#A0522D" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: "#A0522D" }}>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderColor: "#A0522D" }}
            />
          </div>

          <button
            className="btn w-100 mt-2"
            style={{ backgroundColor: "#A0522D", color: "#fff", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?
            <span
              style={{ color: "#A0522D", fontWeight: "500", cursor: "pointer", marginLeft: 5 }}
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