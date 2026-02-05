import React from "react";

export default function Topbar() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    user = {};
  }

  return (
    <header 
      className="d-flex justify-content-between align-items-center px-4 sticky-top"
      style={{ 
        height: "70px", 
        backgroundColor: "var(--topbar-bg)", // White
        borderBottom: "1px solid var(--topbar-border)",
        zIndex: 1000
      }}
    >
      {/* Page Context */}
      <div>
        <h6 className="fw-bold mb-0 text-dark">
          {user?.role === "vet" ? "Veterinary Clinical Portal" : "Farmer Management Portal"}
        </h6>
        <small className="text-muted" style={{ fontSize: '0.8rem' }}>
          Overview & Real-time Analytics
        </small>
      </div>

      {/* Identity Section */}
      <div className="d-flex align-items-center">
        <div className="text-end me-3 d-none d-sm-block">
          <div className="fw-bold small text-dark" style={{ lineHeight: 1.2 }}>
            {user?.name || "User Account"}
          </div>
          <span className="role-badge">
            {user?.role || "Guest"}
          </span>
        </div>
        
        <div className="position-relative">
          <img
            src={user?.photo || "/images/default-profile.png"}
            alt="User Profile"
            className="rounded-circle border border-2 shadow-sm"
            width="42"
            height="42"
            style={{ objectFit: 'cover', borderColor: "var(--primary-brown)" }}
          />
          <span 
            className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" 
            style={{ width: '10px', height: '12px' }}
          ></span>
        </div>
      </div>
    </header>
  );
}