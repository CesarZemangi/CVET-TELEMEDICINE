import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Login failed")
      }

      const data = await res.json()

      localStorage.setItem("user", JSON.stringify(data))

      if (data.role === "farmer") {
        navigate("/farmer")
      }

      if (data.role === "vet") {
        navigate("/vet")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

        {error && <p className="text-danger text-center">{error}</p>}

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
            style={{ backgroundColor: "#A0522D", color: "#fff", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
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
  )
}
