import React, { useState } from 'react';
import api from '../services/api';

export default function VetSettings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    sms_opt_in: user.sms_opt_in ?? true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!formData.phone) {
        setMessage('Mobile number is required');
        setLoading(false);
        return;
      }
      const res = await api.put('/auth/profile', formData);
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage('All password fields are required');
        setLoading(false);
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage('New passwords do not match');
        setLoading(false);
        return;
      }

      await api.post('/auth/change-password', passwordData);
      setMessage('Password changed successfully! Please login again.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setMessage('Failed to change password: ' + (err.response?.data?.message || err.message));
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
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                Security Settings
              </h6>

              <div className="mb-3">
                <label className="form-label small fw-bold">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <button 
                className="btn btn-primary px-4 fw-bold" 
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
