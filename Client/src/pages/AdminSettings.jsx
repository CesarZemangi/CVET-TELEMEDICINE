import React, { useState, useEffect } from "react";
import api from "../services/api";
import DashboardSection from "../components/dashboard/DashboardSection";
import ProfileImage from "../components/common/ProfileImage";
import FormModalWrapper from "../components/common/FormModalWrapper";
import { useUser } from "../context/UserContext";

export default function AdminSettings() {
  const { user, updateUserInfo, version: userVersion } = useUser();
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoPassword, setPhotoPassword] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || ""
    });
  }, [user]);

  const getCacheBustedPath = (path) => {
    if (!path) return "";
    const hasQuery = path.includes("?");
    return `${path}${hasQuery ? "&" : "?"}v=${Date.now()}`;
  };

  const persistUser = (res) => {
    const uploadedPath = res?.data?.user?.profile_image || res?.data?.profile_image || user.profile_image;
    const cacheBusted = uploadedPath ? getCacheBustedPath(uploadedPath) : "";
    const updatedUser = {
      ...user,
      ...res?.data?.user,
      profile_image: cacheBusted || user.profile_image
    };
    updateUserInfo(updatedUser);
    return updatedUser;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", profile.name);
      data.append("email", profile.email);
      data.append("phone", profile.phone);
      data.append("sms_opt_in", user.sms_opt_in ?? true);

      const res = await api.put("/user/profile", data);
      const updatedUser = {
        ...user,
        ...res?.data?.user,
        ...profile,
        token: user.token
      };
      updateUserInfo(updatedUser);
      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || ""
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    const emailForAuth = profile.email || user.email;
    if (!selectedFile) {
      setPhotoError("Please choose a photo to upload.");
      return;
    }
    if (!photoPassword.trim()) {
      setPhotoError("Enter your password to confirm the profile photo change.");
      return;
    }

    setLoading(true);
    setPhotoLoading(true);
    setPhotoError("");
    try {
      if (emailForAuth) {
        await api.post("/auth/login", { email: emailForAuth, password: photoPassword });
      }

      const data = new FormData();
      data.append("profile_image", selectedFile);
      const res = await api.put("/user/profile", data);

      persistUser(res);
      setMessage("Profile photo updated successfully!");
      setSelectedFile(null);
      setPreview(null);
      setPhotoPassword("");
      setShowPhotoModal(false);
    } catch (err) {
      setPhotoError(err.response?.data?.message || err.message || "Failed to update photo.");
    } finally {
      setLoading(false);
      setPhotoLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordData;
      if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage("All password fields are required");
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage("New passwords do not match");
        setLoading(false);
        return;
      }
      await api.post("/auth/change-password", passwordData);
      setMessage("Password changed successfully! Please login again.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMessage("Failed to change password: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <DashboardSection title="Admin Settings">
      <div
        className="rounded-4 shadow-lg border border-0"
        style={{
          background: "linear-gradient(135deg, #f4f6fb 0%, #eef1f8 50%, #f8fafc 100%)",
          padding: "2rem",
        }}
      >
        <form onSubmit={handleSave} className="mx-auto" style={{ maxWidth: "600px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1 fw-bold text-dark">Account Profile</h5>
              <small className="text-muted">Update your admin contact details</small>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-3 mb-3 ${message.includes("successfully") ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}
            >
              {message}
            </div>
          )}

          <div className="mb-3 text-center">
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
                htmlFor="admin-file-upload"
                className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
                style={{ backgroundColor: "var(--primary-brown, #6c757d)", color: "#fff" }}
              >
                <i className="bi bi-camera-fill"></i>
              </label>
              <input id="admin-file-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="mt-2">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowPhotoModal(true)}>
                Change Profile Photo
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-muted">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm border-0"
              placeholder="+1 555 555 5555"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg px-4 shadow-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardSection>

    <DashboardSection title="Security">
      <div className="card border-0 shadow-sm" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Change Password</h6>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
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
            <button className="btn btn-primary px-4 fw-bold" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardSection>

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
    </>
  );
}
