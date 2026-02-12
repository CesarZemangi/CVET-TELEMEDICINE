import React from "react";
import { useLocation } from "react-router-dom";
import ProfileImage from "../common/ProfileImage";

export default function Topbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) {
      if (path.includes("animals")) return "Livestock Management";
      if (path.includes("cases")) return "Medical Cases";
      if (path.includes("consultations")) return "Virtual Consultations";
      if (path.includes("settings")) return "Account Settings";
      return "Overview Dashboard";
    }
    return "CVET Portal";
  };

  return (
    <header 
      className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top"
      style={{ height: "70px", zIndex: 1000 }}
    >
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center me-4">
           <ProfileImage
            src={user?.profilePic}
            role={user?.role}
            size="40px"
          />
          <div className="ms-3">
            <h6 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>
              {user?.name || "Welcome"}
            </h6>
            <span className="badge bg-light text-primary border" style={{ fontSize: '0.65rem' }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="vr mx-3 d-none d-md-block" style={{ height: "30px" }}></div>
        <h5 className="mb-0 fw-bold text-muted d-none d-md-block ms-2">{getTitle()}</h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light">
          <i className="bi bi-bell fs-5 text-muted"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </div>
        
        <div className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light">
          <i className="bi bi-chat-dots fs-5 text-muted"></i>
        </div>
      </div>
    </header>
  );
}
