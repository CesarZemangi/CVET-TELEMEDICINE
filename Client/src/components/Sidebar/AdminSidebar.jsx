import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const [openSection, setOpenSection] = useState("");

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? "" : sectionName);
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 transition-all ${
      isActive 
        ? "bg-white bg-opacity-25 text-white fw-bold shadow-sm" 
        : "text-white text-opacity-75 hover-opacity-100"
    }`;

  const sectionHeaderClass = "px-3 py-2 fw-bold text-white cursor-pointer d-flex justify-content-between align-items-center mt-2 text-opacity-75 hover-opacity-100";
  
  const dropdownContainerClass = "ps-4 d-flex flex-column gap-1 mt-1 border-start border-white border-opacity-25 ms-3 mb-2";

  return (
    <>
      <li className="nav-item">
        <NavLink to="/admindashboard" end className={linkClass}>
          <i className="bi bi-speedometer2 me-3"></i> Overview
        </NavLink>
      </li>

      {/* Farmer Pages Monitor */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("farmerPages")}>
          <span><i className="bi bi-person-badge me-3"></i> Farmer Content</span>
          <small>{openSection === "farmerPages" ? "▾" : "▸"}</small>
        </div>
        {openSection === "farmerPages" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/farmerdashboard/animals" className={linkClass}>Livestock</NavLink>
            <NavLink to="/farmerdashboard/cases" className={linkClass}>Cases</NavLink>
            <NavLink to="/farmerdashboard/consultations" className={linkClass}>Consultations</NavLink>
            <NavLink to="/farmerdashboard/diagnostics/lab-requests" className={linkClass}>Lab Requests</NavLink>
            <NavLink to="/farmerdashboard/nutrition/feed-plans" className={linkClass}>Feed Plans</NavLink>
          </div>
        )}
      </li>

      {/* Vet Pages Monitor */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("vetPages")}>
          <span><i className="bi bi-shield-check me-3"></i> Vet Content</span>
          <small>{openSection === "vetPages" ? "▾" : "▸"}</small>
        </div>
        {openSection === "vetPages" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/vetdashboard/appointments" className={linkClass}>Appointments</NavLink>
            <NavLink to="/vetdashboard/cases" className={linkClass}>Cases</NavLink>
            <NavLink to="/vetdashboard/diagnostics/lab-requests" className={linkClass}>Lab Requests</NavLink>
            <NavLink to="/vetdashboard/treatment/prescriptions" className={linkClass}>Prescriptions</NavLink>
          </div>
        )}
      </li>

      {/* User Management */}
      <li className="nav-item mt-2">
        <NavLink to="/admindashboard/users" className={linkClass}>
          <i className="bi bi-people me-3"></i> Manage Users
        </NavLink>
      </li>

      <li className="nav-item">
        <NavLink to="/admindashboard/logs" className={linkClass}>
          <i className="bi bi-journal-text me-3"></i> System Logs
        </NavLink>
      </li>
    </>
  );
}
