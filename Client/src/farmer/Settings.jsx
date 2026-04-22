import React, { useEffect, useState } from 'react';
import ProfileImage from '../components/common/ProfileImage';
import FormModalWrapper from '../components/common/FormModalWrapper';
import api from '../services/api';
import { useUser } from '../context/UserContext';

export default function Settings() {
  const { user, updateUserInfo, version: userVersion } = useUser();
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    sms_opt_in: user.sms_opt_in ?? true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoPassword, setPhotoPassword] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const cacheBust = (path) => {
    if (!path) return "";
    return `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
  };

  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      sms_opt_in: user.sms_opt_in ?? true
    });
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setShowPhotoModal(true);
      setPhotoError("");
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!formData.phone) {
        setMessage('Mobile number is required');
        setLoading(false);
        return;
      }
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email || user.email || '');
      data.append('phone', formData.phone);
      data.append('sms_opt_in', formData.sms_opt_in);

      const res = await api.put('/user/profile', data);
      const uploadedPath = res.data?.user?.profile_image || res.data?.profile_image || user.profile_image;
      const updatedUser = {
        ...user,
        ...res.data.user,
        profile_image: uploadedPath ? cacheBust(uploadedPath) : user.profile_image,
        token: user.token
      };
      updateUserInfo(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        sms_opt_in: updatedUser.sms_opt_in ?? true
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (photoLoading) return;
    const emailForAuth = formData.email || user.email;
    if (!selectedFile) {
      setPhotoError("Please choose a photo to upload.");
      return;
    }
    if (!photoPassword.trim()) {
      setPhotoError("Enter your password to confirm the profile photo change.");
      return;
    }
    setPhotoLoading(true);
    setPhotoError("");
    setLoading(true);
    try {
      if (emailForAuth) {
        await api.post('/auth/login', { email: emailForAuth, password: photoPassword });
      }
      const data = new FormData();
      data.append('profile_image', selectedFile);
      const res = await api.put('/user/profile', data);

      const uploadedPath = res.data?.user?.profile_image || res.data?.profile_image || user.profile_image;
      updateUserInfo({
        ...res.data.user,
        profile_image: uploadedPath ? cacheBust(uploadedPath) : user.profile_image
      });
      setMessage('Profile photo updated successfully!');
      setSelectedFile(null);
      setPreview(null);
      setPhotoPassword("");
      setShowPhotoModal(false);
    } catch (err) {
      setPhotoError(err.response?.data?.message || err.message || 'Failed to update photo.');
    } finally {
      setLoading(false);
      setPhotoLoading(false);
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
      setPasswordData(() => ({ currentPassword: '', newPassword: '', confirmPassword: '' }));
      
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
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Account Settings</h4>
        <small className="text-muted">Manage your personal and notification preferences</small>
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
              <div className="mb-4 text-center">
                <div className="d-inline-block position-relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-circle border border-3 border-white shadow-sm"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <ProfileImage
                      key={userVersion}
                      src={user.profile_image}
                      role={user.role}
                      size="120px"
                      cacheKey={userVersion}
                    />
                  )}
                  <label
                    htmlFor="farmer-file-upload"
                    className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
                    style={{ backgroundColor: "var(--primary-brown, #6c757d)", color: "#fff" }}
                  >
                    <i className="bi bi-camera-fill"></i>
                  </label>
                  <input id="farmer-file-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="mt-2">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowPhotoModal(true)}>
                    Change Profile Photo
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, sms_opt_in: e.target.checked }))}
                  />
                  <label className="form-check-label small" htmlFor="smsOptIn">
                    Receive SMS alerts for new messages and case updates
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
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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


  <FormModalWrapper
    show={showPhotoModal}
    title="Change Profile Photo"
    onClose={() => {
      setShowPhotoModal(false);
      setSelectedFile(null);
      setPreview(null);
      setPhotoPassword("");
      setPhotoError("");
    }}
    onSubmit={handlePhotoSubmit}
    submitLabel={photoLoading ? "Saving..." : "Save Photo"}
    submitDisabled={photoLoading}
  >
    <div className="mb-3">
      <label className="form-label small fw-bold">Upload Photo</label>
      <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required />
      {preview && (
        <div className="mt-3 text-center">
          <img src={preview} alt="Preview" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}
    </div>
    {photoError && <div className="alert alert-danger py-2">{photoError}</div>}
    <div className="mb-3">
      <label className="form-label small fw-bold">Confirm Password</label>
      <input
        type="password"
        className="form-control"
        value={photoPassword}
        onChange={(e) => setPhotoPassword(e.target.value)}
        placeholder="Enter your account password"
        required
        disabled={photoLoading}
      />
    </div>
  </FormModalWrapper>

</div>
  )
}
