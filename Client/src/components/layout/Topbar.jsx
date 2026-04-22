import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileImage from "../common/ProfileImage";
import api from "../../services/api";
import socket from "../../services/socket";
import { useUser } from "../../context/UserContext";

export default function Topbar({ isMobile = false, onMenuClick = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, version: userVersion, refreshFromStorage } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const getSectionRole = () => {
    const path = location.pathname;
    if (path.includes("/admindashboard")) return "admin";
    if (path.includes("/vetdashboard")) return "vet";
    if (path.includes("/farmerdashboard")) return "farmer";
    return user?.role?.toLowerCase() || "farmer";
  };

  const getSettingsRoute = () => {
    const role = getSectionRole();
    if (role === "admin") return "/admindashboard/settings";
    if (role === "vet") return "/vetdashboard/settings";
    return "/farmerdashboard/settings";
  };

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/communication/notifications');
        const raw = res.data?.data ?? res.data ?? [];
        const notifList = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : [];
        setNotifications(notifList);
        const count = notifList.filter((n) => !n?.is_read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Notif error", err);
      }
    };

    const fetchUnreadMessages = async () => {
      try {
        const res = await api.get('/communication/conversations');
        const data = res.data?.data || [];
        const totalUnread = data.reduce((sum, convo) => sum + (Number(convo.unread_count) || 0), 0);
        setUnreadMessages(totalUnread);
      } catch (err) {
        console.error("Message unread error", err);
      }
    };

    fetchNotifs();
    fetchUnreadMessages();

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

    socket.on("receive_message", () => {
      setUnreadMessages(prev => prev + 1);
    });

    socket.on("update_unread_count", ({ count }) => {
      setUnreadMessages(count);
    });

    return () => {
      socket.off("receive_notification");
      socket.off("update_notification_count");
      socket.off("receive_message");
      socket.off("update_unread_count");
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    const onUserUpdated = () => refreshFromStorage();
    const onFocus = () => refreshFromStorage();
    const onStorage = () => refreshFromStorage();
    document.addEventListener("click", onClickOutside);
    window.addEventListener("user-updated", onUserUpdated);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("click", onClickOutside);
      window.removeEventListener("user-updated", onUserUpdated);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async (e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete('/communication/notifications/clear/all');
      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const handleNotificationClick = (e) => {
    if (e) e.stopPropagation();
    setShowNotifications(false);
    const role = getSectionRole();
    if (role === 'admin') navigate('/admindashboard/communication/notifications');
    else if (role === 'vet') navigate('/vetdashboard/communication/notifications');
    else if (role === 'farmer') navigate('/farmerdashboard/communication/notifications');
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
            title="Notifications"
          >
            <div className="d-flex align-items-center gap-2" onClick={handleNotificationClick}>
              <i className="bi bi-bell fs-5 text-muted"></i>
              <span className="small d-none d-lg-inline text-muted">Notifications</span>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem', marginLeft: '15px', marginTop: '5px' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            
            <i 
              className={`bi bi-chevron-down small text-muted cursor-pointer ${showNotifications ? 'rotate-180' : ''}`}
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
            ></i>
            
            {showNotifications && (
              <div className="position-absolute end-0 mt-5 bg-white shadow-lg border rounded-3 overflow-hidden" style={{ width: '300px', zIndex: 1100, top: '100%' }} onClick={(e) => e.stopPropagation()}>
                <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold small text-primary cursor-pointer" onClick={handleNotificationClick}>Notifications</h6>
                  {notifications.length > 0 && (
                    <small className="text-danger cursor-pointer fw-bold" style={{ fontSize: '0.8rem' }} onClick={handleClearAll}>Clear all</small>
                  )}
                </div>
                <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 border-bottom hover-bg-light cursor-pointer ${!n.is_read ? 'bg-primary bg-opacity-10' : ''}`}
                      onClick={handleNotificationClick}
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
            onClick={(e) => {
              e.stopPropagation();
              const role = getSectionRole();
              if (role === 'admin') navigate('/admindashboard/communication/messages');
              else if (role === 'vet') navigate('/vetdashboard/communication/messages');
              else if (role === 'farmer') navigate('/farmerdashboard/communication/messages');
            }}
            title="Messages"
          >
            <i className="bi bi-chat-dots fs-5 text-muted"></i>
            <span className="small d-none d-lg-inline text-muted">Messages</span>
            {unreadMessages > 0 && (
              <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem', marginLeft: '12px', marginTop: '4px' }}>
                {unreadMessages}
              </span>
            )}
          </div>
        </div>

        <div className="vr d-none d-md-block" style={{ height: "30px" }}></div>

        <div className="d-flex align-items-center position-relative" ref={profileMenuRef}>
          <div className="text-end me-3 d-none d-sm-block">
            <h6 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>
              {user?.name || "User Name"}
            </h6>
            <small className="text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>
              {(getSectionRole() || user?.role || "PORTAL").toUpperCase()}
            </small>
          </div>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileMenu((prev) => !prev);
            }}
            title="Profile options"
          >
            <ProfileImage
              key={userVersion}
              src={
                user?.profile_image
                  ? `${user.profile_image}${user.profile_image.includes("?") ? "&" : "?"}t=${userVersion}`
                  : null
              }
              role={user?.role}
              name={user?.name}
              size="45px"
              className="shadow-sm border-primary border-opacity-25"
              cacheKey={userVersion}
            />
          </button>
          {showProfileMenu && (
            <div
              className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-sm overflow-hidden"
              style={{ top: "100%", minWidth: "220px", zIndex: 1200 }}
            >
              <button
                type="button"
                className="dropdown-item py-2"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(getSettingsRoute());
                }}
              >
                <i className="bi bi-gear me-2"></i>
                Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
