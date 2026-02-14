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
          <i className="bi bi-speedometer2 me-3"></i> Dashboard
        </NavLink>
      </li>

      {/* User Management */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("userMgmt")}>
          <span><i className="bi bi-people me-3"></i> User Management</span>
          <small>{openSection === "userMgmt" ? "▾" : "▸"}</small>
        </div>
        {openSection === "userMgmt" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/admindashboard/users" className={linkClass}>Manage Users</NavLink>
            <NavLink to="/admindashboard/farmers" className={linkClass}>Farmers</NavLink>
            <NavLink to="/admindashboard/vets" className={linkClass}>Vets</NavLink>
          </div>
        )}
      </li>

      {/* Operations */}
      <li>
        <div className={sectionHeaderClass} onClick={() => toggleSection("operations")}>
          <span><i className="bi bi-gear me-3"></i> Operations</span>
          <small>{openSection === "operations" ? "▾" : "▸"}</small>
        </div>
        {openSection === "operations" && (
          <div className={dropdownContainerClass}>
            <NavLink to="/admindashboard/cases" className={linkClass}>Cases</NavLink>
            <NavLink to="/admindashboard/consultations" className={linkClass}>Consultations</NavLink>
            <NavLink to="/admindashboard/media-reports" className={linkClass}>Media Reports</NavLink>
          </div>
        )}
      </li>

      <li className="nav-item">
        <NavLink to="/admindashboard/analytics" className={linkClass}>
          <i className="bi bi-graph-up me-3"></i> Analytics
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
