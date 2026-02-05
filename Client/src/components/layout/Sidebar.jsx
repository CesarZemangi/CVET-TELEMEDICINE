import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Safety Check: Prevent crash if user data is missing
  let user = {};
  try {
    const savedUser = localStorage.getItem("user");
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("User data parse error:", error);
  }

  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Architect Style Active Link Logic
  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded mb-2 transition-all ${
      isActive 
        ? "bg-cream text-brown fw-bold shadow-sm" 
        : "text-white opacity-75 hover-opacity-100"
    }`;

  if (!role) return null; // Don't render if no user session exists

  return (
    <aside
      className="d-flex flex-column shadow"
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "var(--primary-brown)", // #A0522D
        zIndex: 1100,
      }}
    >
      {/* Brand Section */}
      <div className="p-4 border-bottom border-white border-opacity-10 text-center">
        <h5 className="fw-bold m-0 text-white tracking-wider">CVET PORTAL</h5>
        <small className="text-cream opacity-75 text-uppercase" style={{ fontSize: '0.7rem' }}>
          Telemedicine System
        </small>
      </div>

      {/* Navigation Links */}
      <div className="flex-grow-1 overflow-auto p-3">
        <ul className="nav flex-column">
          <li>
            <NavLink to={role === "vet" ? "/vet" : "/farmer"} end className={linkClass}>
              <i className="bi bi-speedometer2 me-3"></i> Dashboard
            </NavLink>
          </li>
          
          <li className="mt-4 mb-2 small text-uppercase text-cream opacity-50 px-3 font-weight-bold">
            Management
          </li>
          
          <li>
            <NavLink to={`/${role}/cases`} className={linkClass}>
              <i className="bi bi-clipboard-pulse me-3"></i> Cases
            </NavLink>
          </li>

          {role === "farmer" && (
            <li>
              <NavLink to="/farmer/animals" className={linkClass}>
                <i className="bi bi-piggy-bank me-3"></i> My Livestock
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to={`/${role}/consultations`} className={linkClass}>
              <i className="bi bi-chat-dots me-3"></i> Consultations
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logout Pinned to Bottom */}
      <div className="p-3 border-top border-white border-opacity-10">
        <button 
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center justify-content-center py-2 rounded-pill shadow-sm transition-all"
          style={{ 
            backgroundColor: "var(--secondary-cream)", 
            color: "var(--primary-brown)", 
            fontWeight: "bold", 
            border: "none" 
          }}
        >
          <i className="bi bi-box-arrow-left me-2"></i> 
          LOGOUT
        </button>
      </div>
    </aside>
  );
}