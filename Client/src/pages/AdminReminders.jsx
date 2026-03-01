import React, { useState, useEffect } from "react";
import { createAdminReminder, getAdminReminders } from "../services/reminder";
import DashboardSection from "../components/dashboard/DashboardSection";
import FormModalWrapper from "../components/common/FormModalWrapper";

export default function AdminReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_role: "farmer",
    schedule_date: new Date().toISOString().split('T')[0]
  });

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await getAdminReminders();
      setReminders(data || []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminReminder(formData);
      setShowModal(false);
      setFormData({
        title: "",
        message: "",
        target_role: "farmer",
        schedule_date: new Date().toISOString().split('T')[0]
      });
      fetchReminders();
    } catch (err) {
      alert("Failed to create reminder: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        // Note: Delete endpoint might need to be implemented in the API service
        // For now, we'll just show the intent
        console.log("Delete reminder:", id);
        // await api.delete(`/admin/reminders/${id}`);
        // fetchReminders();
      } catch (err) {
        alert("Failed to delete reminder: " + err.message);
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">System Reminders</h4>
          <p className="text-muted small">Broadcast messages to farmers and vets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-megaphone-fill me-2"></i> Create Reminder
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Title</th>
                  <th>Target Role</th>
                  <th>Schedule Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>
                ) : reminders.length > 0 ? reminders.map(reminder => (
                  <tr key={reminder.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{reminder.title}</div>
                      <div className="text-muted small text-truncate" style={{maxWidth: '300px'}}>{reminder.message}</div>
                    </td>
                    <td>
                      <span className={`badge ${reminder.target_role === 'farmer' ? 'bg-success' : 'bg-primary'}`}>
                        {reminder.target_role.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(reminder.schedule_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${reminder.status === 'scheduled' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {reminder.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        title="Delete reminder"
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No reminders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FormModalWrapper
        show={showModal}
        title="Create System Broadcast"
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        submitLabel="Send Reminder"
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Reminder Title</label>
          <input
            type="text"
            className="form-control"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Vaccination Campaign"
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Target Audience</label>
          <select
            className="form-select"
            value={formData.target_role}
            onChange={e => setFormData({...formData, target_role: e.target.value})}
          >
            <option value="farmer">All Farmers</option>
            <option value="vet">All Veterinarians</option>
            <option value="all">Everyone</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Broadcast Date</label>
          <input
            type="date"
            className="form-control"
            required
            value={formData.schedule_date}
            onChange={e => setFormData({...formData, schedule_date: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Message Content</label>
          <textarea
            className="form-control"
            rows="4"
            required
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            placeholder="Enter the detailed announcement here..."
          ></textarea>
        </div>
      </FormModalWrapper>
    </div>
  );
}
