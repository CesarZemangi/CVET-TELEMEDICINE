import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FarmerSidebar from "../Sidebar/FarmerSidebar";
import VetSidebar from "../Sidebar/VetSidebar";
import ProfileImage from "../common/ProfileImage";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded mb-2 transition-all ${
      isActive ? "bg-cream text-brown fw-bold shadow-sm" : "text-white opacity-75 hover-opacity-100"
    }`;

  if (!role) return null;

  return (
    <aside
      className="d-flex flex-column shadow"
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "var(--primary-brown)",
        zIndex: 1100,
      }}
    >
      {/* Brand Header */}
      <div className="p-4 border-bottom border-white border-opacity-10 text-center">
        <h5 className="fw-bold m-0 text-white tracking-wider">CVET PORTAL</h5>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-grow-1 overflow-auto p-3 hide-scrollbar">
        <ul className="nav flex-column">
          <li>
            <NavLink to={role === "vet" ? "/vet" : "/farmer"} end className={linkClass}>
              <i className="bi bi-speedometer2 me-3"></i> Dashboard
            </NavLink>
          </li>
          
          {/* Role-specific links injected here */}
          {role === "farmer" && <FarmerSidebar />}
          {role === "vet" && <VetSidebar />}
          
          <li className="mt-auto pt-3">
            <NavLink to={`/${role}/settings`} className={linkClass}>
              <i className="bi bi-gear me-3"></i> Settings
            </NavLink>
          </li>
        </ul>
      </div>

      {/* User Profile & Logout Section */}
      <div className="p-3 border-top border-white border-opacity-10">
        
        {/* Profile Card showing the role-based image */}
        <div className="d-flex align-items-center mb-3 ps-2">
          <ProfileImage 
            src={user?.profilePic} 
            role={role} 
            size="45px" 
          />
          <div className="ms-3 overflow-hidden">
            <p className="m-0 text-white fw-bold small text-truncate">
              {user?.firstName || "User"} {user?.lastName || ""}
            </p>
            <p className="m-0 text-cream opacity-75 text-capitalize" style={{ fontSize: '0.7rem' }}>
              {role}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="btn w-100 fw-bold d-flex align-items-center justify-content-center" 
          style={{ 
            backgroundColor: "var(--secondary-cream)", 
            color: "var(--primary-brown)",
            border: "none"
          }}
        >
          <i className="bi bi-box-arrow-left me-2"></i> LOGOUT
        </button>
      </div>
    </aside>
  );
}