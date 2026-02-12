import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function VetSidebar() {
  const [openSection, setOpenSection] = useState("");

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? "" : sectionName);
  };

  // Styles to match the parent brown sidebar
  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 transition-all ${
      isActive 
        ? "bg-cream text-brown fw-bold shadow-sm" 
        : "text-white opacity-75 hover-opacity-100"
    }`;

  const sectionHeaderClass = "px-3 py-2 fw-bold text-white cursor-pointer d-flex justify-content-between align-items-center mt-2 opacity-75 hover-opacity-100";
  
  const dropdownContainerClass = "ps-4 d-flex flex-column gap-1 mt-1 border-start border-white border-opacity-25 ms-3 mb-2";

  return (
    <>
      {/* Overview & Appointments (No Dropdown) */}
      <li>
        <NavLink to="/vetdashboard/appointments" className={linkClass}>
          <i className="bi bi-calendar-event me-3"></i> Appointments
        </NavLink>
      </li>
      <li>
        <NavLink to="/vetdashboard/cases" className={linkClass}>
          <i className="bi bi-folder2-open me-3"></i> Cases
        </NavLink>
      </li>

      {/* Diagnostics Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("diagnostics")}>
          <span><i className="bi bi-droplet-fill me-3"></i> Diagnostics</span>
          <small>{openSection === "diagnostics" ? "▾" : "▸"}</small>
        </div>
        {openSection === "diagnostics" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/vetdashboard/diagnostics/lab-requests" className={linkClass}>Lab Requests</NavLink>
            <NavLink to="/vetdashboard/diagnostics/lab-results" className={linkClass}>Lab Results</NavLink>
            <NavLink to="/vetdashboard/diagnostics/imaging-reports" className={linkClass}>Imaging Reports</NavLink>
            <NavLink to="/vetdashboard/diagnostics/disease-tracking" className={linkClass}>Disease Tracking</NavLink>
            <NavLink to="/vetdashboard/diagnostics/preventive-screenings" className={linkClass}>Screenings</NavLink>
          </div>
        )}
      </li>

      {/* Treatment Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("treatment")}>
          <span><i className="bi bi-bandaid-fill me-3"></i> Treatment</span>
          <small>{openSection === "treatment" ? "▾" : "▸"}</small>
        </div>
        {openSection === "treatment" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/vetdashboard/treatment/prescriptions" className={linkClass}>Prescriptions</NavLink>
            <NavLink to="/vetdashboard/treatment/plans" className={linkClass}>Treatment Plans</NavLink>
            <NavLink to="/vetdashboard/treatment/history" className={linkClass}>Med History</NavLink>
            <NavLink to="/vetdashboard/treatment/follow-ups" className={linkClass}>Follow Ups</NavLink>
            <NavLink to="/vetdashboard/treatment/surgical-cases" className={linkClass}>Surgical Cases</NavLink>
          </div>
        )}
      </li>

      {/* Analytics Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("analytics")}>
          <span><i className="bi bi-bar-chart-line-fill me-3"></i> Analytics</span>
          <small>{openSection === "analytics" ? "▾" : "▸"}</small>
        </div>
        {openSection === "analytics" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/vetdashboard/analytics/case-statistics" className={linkClass}>Case Stats</NavLink>
            <NavLink to="/vetdashboard/analytics/consultation-reports" className={linkClass}>Reports</NavLink>
            <NavLink to="/vetdashboard/analytics/treatment-effectiveness" className={linkClass}>Effectiveness</NavLink>
            <NavLink to="/vetdashboard/analytics/animal-health-trends" className={linkClass}>Health Trends</NavLink>
            <NavLink to="/vetdashboard/analytics/export" className={linkClass}>Export</NavLink>
          </div>
        )}
      </li>

      {/* Communication Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("communication")}>
          <span><i className="bi bi-envelope-fill me-3"></i> Communication</span>
          <small>{openSection === "communication" ? "▾" : "▸"}</small>
        </div>
        {openSection === "communication" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/vetdashboard/communication/messages" className={linkClass}>Messages</NavLink>
            <NavLink to="/vetdashboard/communication/notifications" className={linkClass}>Notifications</NavLink>
            <NavLink to="/vetdashboard/communication/chat-logs" className={linkClass}>Chat Logs</NavLink>
            <NavLink to="/vetdashboard/video-sessions" className={linkClass}>Video Sessions</NavLink>
            <NavLink to="/vetdashboard/communication/feedback" className={linkClass}>Feedback</NavLink>
          </div>
        )}
      </li>
    </>
  );
}