import React, { useState, useEffect } from "react";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";
import { Send, Users, MessageSquare, Bell } from "lucide-react";
import ChatInterface from "../components/common/ChatInterface";

export default function AdminCommunication() {
  const [activeTab, setActiveTab] = useState("broadcast");
  const [broadcast, setBroadcast] = useState({ title: "", message: "", type: "broadcast" });
  const [direct, setDirect] = useState({ user_id: "", title: "", message: "", type: "direct" });
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

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/notifications/broadcast", broadcast);
      setStatus({ type: "success", message: "Broadcast sent successfully!" });
      setBroadcast({ title: "", message: "", type: "broadcast" });
    } catch {
      setStatus({ type: "error", message: "Failed to send broadcast." });
    }
  };

  const handleDirect = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/notifications/direct", direct);
      setStatus({ type: "success", message: "Direct notification sent successfully!" });
      setDirect({ user_id: "", title: "", message: "", type: "direct" });
    } catch {
      setStatus({ type: "error", message: "Failed to send notification." });
    }
  };

  return (
    <DashboardSection title="Admin Communication Control">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("broadcast")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${activeTab === "broadcast" ? 'bg-brown-600 text-white border-brown-600' : 'bg-white hover:bg-gray-50'}`}
        >
          <Bell className="w-4 h-4" /> Broadcast
        </button>
        <button 
          onClick={() => setActiveTab("direct")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${activeTab === "direct" ? 'bg-brown-600 text-white border-brown-600' : 'bg-white hover:bg-gray-50'}`}
        >
          <Users className="w-4 h-4" /> Direct Notify
        </button>
        <button 
          onClick={() => setActiveTab("chats")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${activeTab === "chats" ? 'bg-brown-600 text-white border-brown-600' : 'bg-white hover:bg-gray-50'}`}
        >
          <MessageSquare className="w-4 h-4" /> Monitor Chats
        </button>
      </div>

      {status.message && (
        <div className={`p-3 rounded-lg mb-4 ${status.type === "success" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {activeTab === "broadcast" && (
          <form onSubmit={handleBroadcast}>
            <h3 className="text-lg font-bold mb-4">Send System Broadcast</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={broadcast.title}
                  onChange={e => setBroadcast({...broadcast, title: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2" 
                  placeholder="e.g. System Maintenance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={broadcast.message}
                  onChange={e => setBroadcast({...broadcast, message: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 h-32" 
                  placeholder="Broadcast details..."
                  required
                />
              </div>
              <button type="submit" className="bg-brown-600 text-white px-6 py-2 rounded-lg hover:bg-brown-700 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send to All Users
              </button>
            </div>
          </form>
        )}

        {activeTab === "direct" && (
          <form onSubmit={handleDirect}>
            <h3 className="text-lg font-bold mb-4">Direct Notification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                <select 
                  value={direct.user_id}
                  onChange={e => setDirect({...direct, user_id: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                >
                  <option value="">Choose user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={direct.title}
                  onChange={e => setDirect({...direct, title: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={direct.message}
                  onChange={e => setDirect({...direct, message: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 h-32" 
                  required
                />
              </div>
              <button type="submit" className="bg-brown-600 text-white px-6 py-2 rounded-lg hover:bg-brown-700 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Notification
              </button>
            </div>
          </form>
        )}

        {activeTab === "chats" && (
          <div style={{ backgroundColor: "#1a1a1a", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: "#fff" }}>Chat Monitoring (Read-Only)</h3>
            <ChatInterface readOnly={true} />
          </div>
        )}
      </div>
    </DashboardSection>
  );
}