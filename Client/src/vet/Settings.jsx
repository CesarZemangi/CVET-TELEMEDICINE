import React, { useState } from 'react';
import api from '../services/api';

export default function VetSettings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    sms_opt_in: user.sms_opt_in ?? true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await api.put('/auth/profile', formData);
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Professional Settings</h4>
        <small className="text-muted">Manage your professional profile and notification preferences</small>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} border-0 shadow-sm mb-4`}>
          {message}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Profile Information</h6>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +254700000000"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold d-block">Notifications</label>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="smsOptIn" 
                    checked={formData.sms_opt_in}
                    onChange={(e) => setFormData({ ...formData, sms_opt_in: e.target.checked })}
                  />
                  <label className="form-check-label small" htmlFor="smsOptIn">
                    Receive SMS alerts for new cases and critical messages
                  </label>
                </div>
              </div>

              <button className="btn btn-primary px-4 fw-bold" onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                Availability
              </h6>

              <select className="form-select mb-3">
                <option>Available</option>
                <option>Busy</option>
              </select>

              <button className="btn btn-success">
                Update Status
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
