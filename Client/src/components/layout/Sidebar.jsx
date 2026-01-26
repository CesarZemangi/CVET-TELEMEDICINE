import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  // Read logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"))
  const role = user?.role

  // Toggle states for dropdown sections
  const [showFarmHealth, setShowFarmHealth] = useState(false)
  const [showVetAdvanced, setShowVetAdvanced] = useState(false)

  // Shared NavLink styling
  const linkClass = ({ isActive }) =>
    "nav-link d-flex align-items-center px-3 py-2 rounded " +
    (isActive ? "bg-primary text-white" : "text-white")

  return (
    <aside
      className="d-flex flex-column p-3"
      style={{
        width: 260,
        minHeight: "100vh",
        backgroundColor: "#3E2723"
      }}
    >
      {/* ================= PROFILE SECTION ================= */}
      <div className="text-center mb-4">
        <img
          src={user?.photo || "https://via.placeholder.com/80"}
          alt="profile"
          className="rounded-circle mb-2"
          width="80"
          height="80"
        />
        <h6 className="mb-0">{user?.name || "User"}</h6>
        <small className="text-success">Active</small>
      </div>

      {/* ================= NAVIGATION ================= */}
      <ul className="nav flex-column gap-1">

        {/* =====================================================
            FARMER SIDEBAR
        ===================================================== */}
        {role === "farmer" && (
          <>
            {/* Dashboard */}
            <li>
              <NavLink to="/farmer" end className={linkClass}>
                <i className="bi bi-grid me-2"></i>
                Dashboard
              </NavLink>
            </li>

            {/* Farm Health Dropdown */}
            <li className="mt-2">
              <div
                className="px-3 py-2 fw-semibold text-white cursor-pointer"
                onClick={() => setShowFarmHealth(!showFarmHealth)}
              >
                <i className="bi bi-heart-pulse me-2"></i>
                Farm Health {showFarmHealth ? "▾" : "▸"}
              </div>

              {/* Nested Farm Health Routes */}
              {showFarmHealth && (
                <div className="ms-3">
                  <NavLink to="/farmer/vet-responses" className={linkClass}>
                    Vet Responses
                  </NavLink>
                  <NavLink to="/farmer/active-animals" className={linkClass}>
                    Active Animals
                  </NavLink>
                  <NavLink to="/farmer/health-coverage" className={linkClass}>
                    Health Coverage
                  </NavLink>
                  <NavLink to="/farmer/treatment-progress" className={linkClass}>
                    Treatment Progress
                  </NavLink>
                  <NavLink to="/farmer/reports" className={linkClass}>
                    Reports
                  </NavLink>
                </div>
              )}
            </li>

            {/* Core Farmer Pages */}
            <li className="mt-2">
              <NavLink to="/farmer/animals" className={linkClass}>
                <i className="bi bi-house-heart me-2"></i>
                Livestock
              </NavLink>
            </li>

            <li>
              <NavLink to="/farmer/cases" className={linkClass}>
                <i className="bi bi-file-earmark-medical me-2"></i>
                Cases
              </NavLink>
            </li>

            <li>
              <NavLink to="/farmer/consultations" className={linkClass}>
                <i className="bi bi-chat-dots me-2"></i>
                Consultations
              </NavLink>
            </li>

            {/* Settings always pinned to bottom */}
            <li className="mt-auto">
              <NavLink to="/farmer/settings" className={linkClass}>
                <i className="bi bi-gear me-2"></i>
                Settings
              </NavLink>
            </li>
          </>
        )}

        {/* =====================================================
            VET SIDEBAR
        ===================================================== */}
        {role === "vet" && (
          <>
            {/* Dashboard */}
            <li>
              <NavLink to="/vet" end className={linkClass}>
                <i className="bi bi-grid me-2"></i>
                Dashboard
              </NavLink>
            </li>

            {/* Core Vet Pages */}
            <li>
              <NavLink to="/vet/cases" className={linkClass}>
                <i className="bi bi-inbox me-2"></i>
                Cases
              </NavLink>
            </li>

            <li>
              <NavLink to="/vet/appointments" className={linkClass}>
                <i className="bi bi-calendar-check me-2"></i>
                Appointments
              </NavLink>
            </li>

            <li>
              <NavLink to="/vet/consultations" className={linkClass}>
                <i className="bi bi-chat-dots me-2"></i>
                Consultations
              </NavLink>
            </li>

            {/* Advanced Vet Sections Dropdown */}
            <li className="mt-2">
              <div
                className="px-3 py-2 fw-semibold text-white cursor-pointer"
                onClick={() => setShowVetAdvanced(!showVetAdvanced)}
              >
                <i className="bi bi-clipboard-data me-2"></i>
                Clinical Tools {showVetAdvanced ? "▾" : "▸"}
              </div>

              {showVetAdvanced && (
                <div className="ms-3">
                  <NavLink to="/vet/diagnostics" className={linkClass}>
                    Diagnostics
                  </NavLink>
                  <NavLink to="/vet/treatment" className={linkClass}>
                    Treatment
                  </NavLink>
                  <NavLink to="/vet/analytics" className={linkClass}>
                    Analytics
                  </NavLink>
                  <NavLink to="/vet/communication" className={linkClass}>
                    Communication
                  </NavLink>
                </div>
              )}
            </li>

            {/* Settings */}
            <li className="mt-auto">
              <NavLink to="/vet/settings" className={linkClass}>
                <i className="bi bi-gear me-2"></i>
                Settings
              </NavLink>
            </li>
          </>
        )}

      </ul>
    </aside>
  )
}
