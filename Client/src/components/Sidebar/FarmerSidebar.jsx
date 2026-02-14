import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function FarmerSidebar() {
  const [openSection, setOpenSection] = useState("");

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? "" : sectionName);
  };

  // Consistent styling for the brown background
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
      {/* Basic Management Links */}
      <li>
        <NavLink to="/farmerdashboard" end className={linkClass}>
          <i className="bi bi-speedometer2 me-3"></i> Overview
        </NavLink>
      </li>
      <li>
        <NavLink to="/farmerdashboard/animals" className={linkClass}>
          <i className="bi bi-piggy-bank me-3"></i> My Livestock
        </NavLink>
      </li>
      <li>
        <NavLink to="/farmerdashboard/cases" className={linkClass}>
          <i className="bi bi-clipboard-pulse me-3"></i> Cases
        </NavLink>
      </li>
      <li>
        <NavLink to="/farmerdashboard/consultations" className={linkClass}>
          <i className="bi bi-chat-dots me-3"></i> Consultations
        </NavLink>
      </li>

      {/* Diagnostics Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("diagnostics")}>
          <span><i className="bi bi-microscope me-3"></i> Diagnostics</span>
          <small>{openSection === "diagnostics" ? "▾" : "▸"}</small>
        </div>
        {openSection === "diagnostics" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/diagnostics/lab-requests" className={linkClass}>Lab Requests</NavLink>
            <NavLink to="/farmerdashboard/diagnostics/lab-tests" className={linkClass}>Lab Tests</NavLink>
            <NavLink to="/farmerdashboard/diagnostics/lab-results" className={linkClass}>Lab Results</NavLink>
            <NavLink to="/farmerdashboard/diagnostics/imaging-reports" className={linkClass}>Imaging Reports</NavLink>
            <NavLink to="/farmerdashboard/diagnostics/vaccinations" className={linkClass}>Vaccinations</NavLink>
          </div>
        )}
      </li>

      {/* Medications Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("medications")}>
          <span><i className="bi bi-capsule me-3"></i> Medications</span>
          <small>{openSection === "medications" ? "▾" : "▸"}</small>
        </div>
        {openSection === "medications" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/treatment/prescriptions" className={linkClass}>Prescriptions</NavLink>
            <NavLink to="/farmerdashboard/treatment/plans" className={linkClass}>Treatment Plans</NavLink>
            <NavLink to="/farmerdashboard/treatment/history" className={linkClass}>History</NavLink>
            <NavLink to="/farmerdashboard/treatment/medication-schedule" className={linkClass}>Schedule</NavLink>
            <NavLink to="/farmerdashboard/treatment/pharmacy-orders" className={linkClass}>Pharmacy Orders</NavLink>
          </div>
        )}
      </li>

      {/* Analytics Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("analytics")}>
          <span><i className="bi bi-graph-up-arrow me-3"></i> Analytics</span>
          <small>{openSection === "analytics" ? "▾" : "▸"}</small>
        </div>
        {openSection === "analytics" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/analytics/livestock-performance" className={linkClass}>Performance</NavLink>
            <NavLink to="/farmerdashboard/analytics/reports" className={linkClass}>Reports</NavLink>
          </div>
        )}
      </li>

      {/* Communication Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("communication")}>
          <span><i className="bi bi-chat-left-text me-3"></i> Communication</span>
          <small>{openSection === "communication" ? "▾" : "▸"}</small>
        </div>
        {openSection === "communication" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/communication/messages" className={linkClass}>Messages</NavLink>
            <NavLink to="/farmerdashboard/communication/notifications" className={linkClass}>Notifications</NavLink>
            <NavLink to="/farmerdashboard/communication/chat-logs" className={linkClass}>Chat Logs</NavLink>
          </div>
        )}
      </li>

      {/* Nutrition Section */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("nutrition")}>
          <span><i className="bi bi-egg-fried me-3"></i> Nutrition</span>
          <small>{openSection === "nutrition" ? "▾" : "▸"}</small>
        </div>
        {openSection === "nutrition" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/nutrition/dietary-needs" className={linkClass}>Dietary Needs</NavLink>
            <NavLink to="/farmerdashboard/nutrition/feeding-inventory" className={linkClass}>Feeding Inventory</NavLink>
            <NavLink to="/farmerdashboard/nutrition/feed-plans" className={linkClass}>Feed Plans</NavLink>
            <NavLink to="/farmerdashboard/nutrition/reports" className={linkClass}>Reports</NavLink>
            <NavLink to="/farmerdashboard/nutrition/supplements" className={linkClass}>Supplements</NavLink>
          </div>
        )}
      </li>

      {/* Settings at Bottom */}
      <li className="mt-auto pt-4">
        <NavLink to="/farmerdashboard/settings" className={linkClass}>
          <i className="bi bi-gear-fill me-3"></i> Settings
        </NavLink>
      </li>
    </>
  );
}