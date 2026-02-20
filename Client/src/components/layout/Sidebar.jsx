import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FarmerSidebar from "../Sidebar/FarmerSidebar";
import VetSidebar from "../Sidebar/VetSidebar";
import AdminSidebar from "../Sidebar/AdminSidebar";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded mb-2 transition-all ${
      isActive
        ? "bg-white bg-opacity-25 text-white fw-bold shadow-sm"
        : "text-white text-opacity-75 hover-opacity-100"
    }`;

  return (
    <aside
      className="d-flex flex-column shadow"
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "linear-gradient(180deg, #228B22 0%, #1E90FF 100%)",
        zIndex: 1100,
      }}
    >
      <div className="p-4 border-bottom border-white border-opacity-10 text-center">
        <h5 className="fw-bold m-0 text-white tracking-wider">
          CVET TELEMEDICINE
        </h5>
      </div>

      <div className="flex-grow-1 overflow-auto p-3 hide-scrollbar">
        <ul className="nav flex-column">
          <li>
            <NavLink
              to={
                role === "vet"
                  ? "/vetdashboard"
                  : role === "admin"
                  ? "/admindashboard"
                  : "/farmerdashboard"
              }
              end
              className={linkClass}
              onClick={handleNavClick}
            >
              <i className="bi bi-speedometer2 me-3"></i>
              Dashboard
            </NavLink>
          </li>

          {role === "farmer" && <FarmerSidebar />}
          {role === "vet" && <VetSidebar />}
          {role === "admin" && <AdminSidebar />}

          <li className="mt-3">
            <NavLink
              to={
                role === "vet"
                  ? "/vetdashboard/settings"
                  : role === "admin"
                  ? "/admindashboard/settings"
                  : "/farmerdashboard/settings"
              }
              className={linkClass}
            >
              <i className="bi bi-gear me-3"></i>
              Settings
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="p-3 border-top border-white border-opacity-10">
        <button
          onClick={handleLogout}
          className="btn w-100 fw-bold d-flex align-items-center justify-content-center border-white border-opacity-50 text-white"
          style={{
            backgroundColor: "transparent",
            borderRadius: "10px",
          }}
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
