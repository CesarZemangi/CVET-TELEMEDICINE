import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function VetSidebar() {
  const [openDiagnostics, setOpenDiagnostics] = useState(false)
  const [openTreatment, setOpenTreatment] = useState(false)
  const [openAnalytics, setOpenAnalytics] = useState(false)
  const [openCommunication, setOpenCommunication] = useState(false)

  const linkClass = ({ isActive }) =>
    "nav-link px-3 py-2 rounded " +
    (isActive ? "bg-brown text-cream" : "text-brown")

  const sectionTitle =
    "px-3 py-2 fw-semibold text-brown cursor-pointer"

  return (
    <aside
      className="p-3 d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#F5F5DC",
        borderRight: "1px solid #A0522D"
      }}
    >
      <div className="mb-4">
        <h5 className="fw-bold text-brown mb-1">Vet Panel</h5>
        <small className="text-brown">Clinic Dashboard</small>
      </div>

      <ul className="nav flex-column gap-1">

        <li>
          <NavLink to="/vet" end className={linkClass}>
            Overview
          </NavLink>
        </li>

        <li>
          <NavLink to="/vet/appointments" className={linkClass}>
            Appointments
          </NavLink>
        </li>

        <li>
          <NavLink to="/vet/cases" className={linkClass}>
            Cases
          </NavLink>
        </li>

        <li>
          <NavLink to="/vet/consultations" className={linkClass}>
            Consultations
          </NavLink>
        </li>

        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenDiagnostics(!openDiagnostics)}
          >
            Diagnostics {openDiagnostics ? "▾" : "▸"}
          </div>

          {openDiagnostics && (
            <>
              <NavLink to="/vet/lab-requests" className={linkClass}>Lab Requests</NavLink>
              <NavLink to="/vet/lab-results" className={linkClass}>Lab Results</NavLink>
              <NavLink to="/vet/imaging-reports" className={linkClass}>Imaging Reports</NavLink>
              <NavLink to="/vet/disease-tracking" className={linkClass}>Disease Tracking</NavLink>
              <NavLink to="/vet/preventive-screenings" className={linkClass}>Preventive Screenings</NavLink>
            </>
          )}
        </li>

        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenTreatment(!openTreatment)}
          >
            Treatment {openTreatment ? "▾" : "▸"}
          </div>

          {openTreatment && (
            <>
              <NavLink to="/vet/prescriptions" className={linkClass}>Prescriptions</NavLink>
              <NavLink to="/vet/treatment-plans" className={linkClass}>Treatment Plans</NavLink>
              <NavLink to="/vet/medication-history" className={linkClass}>Medication History</NavLink>
              <NavLink to="/vet/follow-ups" className={linkClass}>Follow Ups</NavLink>
              <NavLink to="/vet/surgical-cases" className={linkClass}>Surgical Cases</NavLink>
            </>
          )}
        </li>

        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenAnalytics(!openAnalytics)}
          >
            Analytics {openAnalytics ? "▾" : "▸"}
          </div>

          {openAnalytics && (
            <>
              <NavLink to="/vet/case-statistics" className={linkClass}>Case Statistics</NavLink>
              <NavLink to="/vet/consultation-reports" className={linkClass}>Consultation Reports</NavLink>
              <NavLink to="/vet/treatment-effectiveness" className={linkClass}>Treatment Effectiveness</NavLink>
              <NavLink to="/vet/animal-health-trends" className={linkClass}>Animal Health Trends</NavLink>
              <NavLink to="/vet/export-reports" className={linkClass}>Export Reports</NavLink>
            </>
          )}
        </li>

        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenCommunication(!openCommunication)}
          >
            Communication {openCommunication ? "▾" : "▸"}
          </div>

          {openCommunication && (
            <>
              <NavLink to="/vet/messages" className={linkClass}>Messages</NavLink>
              <NavLink to="/vet/notifications" className={linkClass}>Notifications</NavLink>
              <NavLink to="/vet/chat-logs" className={linkClass}>Chat Logs</NavLink>
              <NavLink to="/vet/video-sessions" className={linkClass}>Video Sessions</NavLink>
              <NavLink to="/vet/feedback" className={linkClass}>Feedback</NavLink>
            </>
          )}
        </li>

        <li className="mt-auto">
          <NavLink to="/vet/settings" className={linkClass}>
            Settings
          </NavLink>
        </li>

      </ul>
    </aside>
  )
}
