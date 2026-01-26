import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const role = email.includes("vet") ? "vet" : "farmer";

    const user = {
      email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(user));
    navigate(`/${role}`);
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: 380,
          borderRadius: "12px",
          backgroundColor: "#fff",
          border: "1px solid #A0522D",
        }}
      >
        <h4 className="text-center fw-bold mb-4" style={{ color: "#A0522D" }}>
          CVET Login
        </h4>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: "#A0522D" }}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: "#A0522D" }}
          />

          <button
            className="btn w-100"
            style={{
              backgroundColor: "#A0522D",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Log in
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <span style={{ color: "#A0522D", fontWeight: "500" }}>Sign up</span>
          </small>
        </div>
      </div>
    </div>
  );
}
