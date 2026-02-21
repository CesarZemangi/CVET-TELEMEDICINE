import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileImage from "../common/ProfileImage";
import api from "../../services/api";
import socket from "../../services/socket";

export default function Topbar({ isMobile = false, onMenuClick = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/communication/notifications');
        const notifList = res.data.data || res.data || [];
        setNotifications(notifList);
        const count = notifList.filter(n => !n.is_read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Notif error", err);
      }
    };

    fetchNotifs();

    // Socket setup
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("receive_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on("update_notification_count", ({ count }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.off("receive_notification");
      socket.off("update_notification_count");
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="d-flex align-items-center gap-3">
        {isMobile && onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="btn btn-sm d-md-none"
            style={{ padding: "6px 12px" }}
          >
            <i className="bi bi-list fs-5 text-muted"></i>
          </button>
        )}
        <h5 className="mb-0 fw-bold text-muted d-none d-md-block">{getTitle()}</h5>
      </div>

      <div className="d-flex align-items-center gap-4">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light d-flex align-items-center gap-2"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <i className="bi bi-bell fs-5 text-muted"></i>
            <span className="small d-none d-lg-inline text-muted">Notifications</span>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem', marginLeft: '15px', marginTop: '5px' }}>
                {unreadCount}
              </span>
            )}
            
            {showNotifications && (
              <div className="position-absolute end-0 mt-5 bg-white shadow-lg border rounded-3 overflow-hidden" style={{ width: '300px', zIndex: 1100, top: '100%' }}>
                <div className="p-3 border-bottom bg-light d-flex justify-content-between">
                  <h6 className="mb-0 fw-bold small">Notifications</h6>
                  <small className="text-primary cursor-pointer">Clear all</small>
                </div>
                <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 border-bottom hover-bg-light cursor-pointer ${!n.is_read ? 'bg-primary bg-opacity-10' : ''}`}
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <h6 className={`mb-1 small ${!n.is_read ? 'fw-bold' : ''}`}>{n.title}</h6>
                      <p className="mb-1 text-muted" style={{ fontSize: '0.75rem' }}>{n.message}</p>
                      <small className="text-muted" style={{ fontSize: '0.65rem' }}>{new Date(n.created_at).toLocaleString()}</small>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-muted small">No notifications yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light d-flex align-items-center gap-2"
            onClick={() => {
              if (user?.role === 'admin') navigate('/admindashboard/communication/messages');
              else if (user?.role === 'vet') navigate('/vetdashboard/communication/messages');
              else navigate('/farmerdashboard/communication/messages');
            }}
            title="Messages"
          >
            <i className="bi bi-chat-dots fs-5 text-muted"></i>
            <span className="small d-none d-lg-inline text-muted">Messages</span>
          </div>
        </div>

        <div className="vr d-none d-md-block" style={{ height: "30px" }}></div>

        <div className="d-flex align-items-center">
          <div className="text-end me-3 d-none d-sm-block">
            <h6 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>
              {user?.name || "User Name"}
            </h6>
            <small className="text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>
              {user?.role?.toUpperCase() || "PORTAL"}
            </small>
          </div>
           <ProfileImage
            src={user?.profilePic}
            role={user?.role}
            size="45px"
            className="shadow-sm border-primary border-opacity-25"
          />
        </div>
      </div>
    </header>
  );
}
