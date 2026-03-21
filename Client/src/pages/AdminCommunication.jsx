import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";
import { Send, Users, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import ChatInterface from "../components/common/ChatInterface";

export default function AdminCommunication() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("direct");
  const [direct, setDirect] = useState({ user_id: "", title: "", message: "" });
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const tab = (searchParams.get("tab") || "").toLowerCase();
    if (["direct", "chats"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleDirect = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/notifications/direct", direct);
      setStatus({ type: "success", message: "✓ Direct notification sent successfully!" });
      setDirect({ user_id: "", title: "", message: "", type: "direct" });
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    } catch (err) {
      setStatus({ type: "error", message: "✗ Failed to send notification: " + (err.response?.data?.error || err.message) });
    }
  };

  return (
    <DashboardSection title="Admin Communication Control">
      <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", borderRadius: "12px", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <button 
            onClick={() => setActiveTab("direct")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "direct" ? "600" : "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s",
              backgroundColor: activeTab === "direct" ? "#7c3aed" : "#1e293b",
              color: activeTab === "direct" ? "#fff" : "#cbd5e1",
              boxShadow: activeTab === "direct" ? "0 4px 12px rgba(124, 58, 237, 0.4)" : "none"
            }}
          >
            <Users size={20} /> Direct Notify
          </button>
          <button 
            onClick={() => setActiveTab("chats")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === "chats" ? "600" : "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s",
              backgroundColor: activeTab === "chats" ? "#7c3aed" : "#1e293b",
              color: activeTab === "chats" ? "#fff" : "#cbd5e1",
              boxShadow: activeTab === "chats" ? "0 4px 12px rgba(124, 58, 237, 0.4)" : "none"
            }}
          >
            <MessageSquare size={20} /> Monitor Chats
          </button>
        </div>

        {status.message && (
          <div style={{
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            backgroundColor: status.type === "success" ? "#064e3b" : "#7f1d1d",
            color: status.type === "success" ? "#86efac" : "#fca5a5",
            border: `1px solid ${status.type === "success" ? "#10b981" : "#dc2626"}`
          }}>
            {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.message}
          </div>
        )}

        <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "2rem", border: "1px solid #334155" }}>
        {activeTab === "direct" && (
          <form onSubmit={handleDirect}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#e2e8f0" }}>👤 Direct Notification</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#cbd5e1", marginBottom: "0.5rem" }}>Select User</label>
                <select 
                  value={direct.user_id}
                  onChange={e => setDirect({...direct, user_id: e.target.value})}
                  style={{ width: "100%", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#e2e8f0", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                  required
                >
                  <option value="">Choose user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#cbd5e1", marginBottom: "0.5rem" }}>Title</label>
                <input 
                  type="text" 
                  value={direct.title}
                  onChange={e => setDirect({...direct, title: e.target.value})}
                  style={{ width: "100%", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#e2e8f0", borderRadius: "8px", padding: "0.75rem", fontSize: "1rem" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#cbd5e1", marginBottom: "0.5rem" }}>Message</label>
                <textarea 
                  value={direct.message}
                  onChange={e => setDirect({...direct, message: e.target.value})}
                  style={{ width: "100%", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#e2e8f0", borderRadius: "8px", padding: "0.75rem", minHeight: "150px", fontSize: "1rem", fontFamily: "inherit" }}
                  required
                />
              </div>
              <button type="submit" style={{ backgroundColor: "#7c3aed", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.3s", width: "fit-content" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#6d28d9"} onMouseLeave={(e) => e.target.style.backgroundColor = "#7c3aed"}>
                <Send size={18} /> Send Notification
              </button>
            </div>
          </form>
        )}

        {activeTab === "chats" && (
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#e2e8f0" }}>💬 Messages</h3>
            <ChatInterface />
          </div>
        )}
        </div>
      </div>
    </DashboardSection>
  );
}
