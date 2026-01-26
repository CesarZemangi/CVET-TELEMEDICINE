import { useNavigate } from "react-router-dom"

export default function Topbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  function logout() {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h6 className="fw-semibold mb-0">
          {user?.role === "farmer" ? "Farmer Portal" : "Vet Portal"}
        </h6>
        <small className="text-muted">Cvet Telemedicine</small>
      </div>

      <button className="btn btn-outline-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  )
}
