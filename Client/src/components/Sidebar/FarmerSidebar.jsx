import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function FarmerSidebar() {
  const [openDiagnostics, setOpenDiagnostics] = useState(false)
  const [openMedications, setOpenMedications] = useState(false)
  const [openAnalytics, setOpenAnalytics] = useState(false)
  const [openCommunication, setOpenCommunication] = useState(false)
  const [openNutrition, setOpenNutrition] = useState(false)

  const linkClass = ({ isActive }) =>
    "nav-link px-3 py-2 rounded " +
    (isActive ? "bg-brown text-cream" : "text-brown")

  const sectionTitle = "px-3 py-2 fw-semibold text-brown cursor-pointer"

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
        <h5 className="fw-bold text-brown mb-1">Farmer Panel</h5>
        <small className="text-brown">My Farm</small>
      </div>

      <ul className="nav flex-column gap-1">

        <li>
          <NavLink to="/farmer" end className={linkClass}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/animals" className={linkClass}>
            Livestock
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/cases" className={linkClass}>
            Cases
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/consultations" className={linkClass}>
            Consultations
          </NavLink>
        </li>

        {/* Diagnostics */}
        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenDiagnostics(!openDiagnostics)}
          >
            Diagnostics {openDiagnostics ? "▾" : "▸"}
          </div>
          {openDiagnostics && (
            <>
              <NavLink to="/farmer/diagnostics/lab-requests" className={linkClass}>Lab Requests</NavLink>
              <NavLink to="/farmer/diagnostics/lab-tests" className={linkClass}>Lab Tests</NavLink>
              <NavLink to="/farmer/diagnostics/lab-results" className={linkClass}>Lab Results</NavLink>
              <NavLink to="/farmer/diagnostics/imaging-reports" className={linkClass}>Imaging Reports</NavLink>
              <NavLink to="/farmer/diagnostics/vaccinations" className={linkClass}>Vaccinations</NavLink>
              <NavLink to="/farmer/diagnostics/disease-history" className={linkClass}>Disease History</NavLink>
              <NavLink to="/farmer/diagnostics/disease-tracking" className={linkClass}>Disease Tracking</NavLink>
              <NavLink to="/farmer/diagnostics/health-metrics" className={linkClass}>Health Metrics</NavLink>
              <NavLink to="/farmer/diagnostics/screenings" className={linkClass}>Screenings</NavLink>
            </>
          )}
        </li>

        {/* Medications */}
        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenMedications(!openMedications)}
          >
            Medications {openMedications ? "▾" : "▸"}
          </div>
          {openMedications && (
            <>
              <NavLink to="/farmer/medications/prescriptions" className={linkClass}>Prescriptions</NavLink>
              <NavLink to="/farmer/medications/treatment-plans" className={linkClass}>Treatment Plans</NavLink>
              <NavLink to="/farmer/medications/medication-history" className={linkClass}>Medication History</NavLink>
              <NavLink to="/farmer/medications/medication-schedule" className={linkClass}>Medication Schedule</NavLink>
              <NavLink to="/farmer/medications/pharmacy-orders" className={linkClass}>Pharmacy Orders</NavLink>
              <NavLink to="/farmer/medications/follow-ups" className={linkClass}>Follow Ups</NavLink>
              <NavLink to="/farmer/medications/surgical-cases" className={linkClass}>Surgical Cases</NavLink>
            </>
          )}
        </li>

        {/* Analytics */}
        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenAnalytics(!openAnalytics)}
          >
            Analytics {openAnalytics ? "▾" : "▸"}
          </div>
          {openAnalytics && (
            <>
              <NavLink to="/farmer/analytics/livestock-performance" className={linkClass}>Livestock Performance</NavLink>
              <NavLink to="/farmer/analytics/treatment-effectiveness" className={linkClass}>Treatment Effectiveness</NavLink>
              <NavLink to="/farmer/analytics/consultation-stats" className={linkClass}>Consultation Stats</NavLink>
              <NavLink to="/farmer/analytics/health-trends" className={linkClass}>Health Trends</NavLink>
              <NavLink to="/farmer/analytics/treatment-stats" className={linkClass}>Treatment Stats</NavLink>
              <NavLink to="/farmer/analytics/reports" className={linkClass}>Reports</NavLink>
            </>
          )}
        </li>

        {/* Communication */}
        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenCommunication(!openCommunication)}
          >
            Communication {openCommunication ? "▾" : "▸"}
          </div>
          {openCommunication && (
            <>
              <NavLink to="/farmer/communication/messages" className={linkClass}>Messages</NavLink>
              <NavLink to="/farmer/communication/notifications" className={linkClass}>Notifications</NavLink>
              <NavLink to="/farmer/communication/chat-logs" className={linkClass}>Chat Logs</NavLink>
              <NavLink to="/farmer/communication/video-sessions" className={linkClass}>Video Sessions</NavLink>
              <NavLink to="/farmer/communication/feedback" className={linkClass}>Feedback</NavLink>
            </>
          )}
        </li>

        {/* Nutrition */}
        <li>
          <div
            className={sectionTitle}
            onClick={() => setOpenNutrition(!openNutrition)}
          >
            Nutrition {openNutrition ? "▾" : "▸"}
          </div>
          {openNutrition && (
            <>
              <NavLink to="/farmer/nutrition/dietary-needs" className={linkClass}>Dietary Needs</NavLink>
              <NavLink to="/farmer/nutrition/feeding-inventory" className={linkClass}>Feeding Inventory</NavLink>
              <NavLink to="/farmer/nutrition/feed-plans" className={linkClass}>Feed Plans</NavLink>
              <NavLink to="/farmer/nutrition/nutrition-reports" className={linkClass}>Nutrition Reports</NavLink>
              <NavLink to="/farmer/nutrition/supplements" className={linkClass}>Supplements</NavLink>
            </>
          )}
        </li>

        <li className="mt-auto">
          <NavLink to="/farmer/settings" className={linkClass}>
            Settings
          </NavLink>
        </li>

      </ul>
    </aside>
  )
}
