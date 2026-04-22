import React, { useState } from "react";
import ProfileImage from "../components/common/ProfileImage";
import FormModalWrapper from "../components/common/FormModalWrapper";
import api from "../services/api";
import { useUser } from "../context/UserContext";

export default function ProfileSettings() {
  const { user, updateUserInfo, version: photoVersion } = useUser();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || ""
  });
  const [photoPassword, setPhotoPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const cacheBust = (path) => {
    if (!path) return "";
    return `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    try {
      const res = await api.put(`/user/profile`, data);
      
      const uploadedPath = res.data?.user?.profile_image || res.data?.profile_image || user.profile_image;
      updateUserInfo({
        ...res.data.user,
        profile_image: uploadedPath ? cacheBust(uploadedPath) : user.profile_image
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error updating profile.");
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
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
    try {
      if (emailForAuth) {
        await api.post("/auth/login", { email: emailForAuth, password: photoPassword });
      }
      const data = new FormData();
      data.append("profile_image", selectedFile);
      const res = await api.put(`/user/profile`, data);

      const uploadedPath = res.data?.user?.profile_image || res.data?.profile_image || user.profile_image;
      updateUserInfo({
        ...res.data.user,
        profile_image: uploadedPath ? cacheBust(uploadedPath) : user.profile_image
      });
      setPreview(null);
      setSelectedFile(null);
      setPhotoPassword("");
      setShowPhotoModal(false);
    } catch (err) {
      setPhotoError(err.response?.data?.message || err.message || "Failed to update profile photo.");
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body p-4 text-center">
          <h4 className="fw-bold mb-4" style={{ color: "var(--primary-brown)" }}>Profile Settings</h4>
          
      <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
                    key={photoVersion}
                    src={user.profile_image}
                    role={user.role}
                    size="120px"
                    cacheKey={photoVersion}
                  />
                )}
                
                <label 
                  htmlFor="file-upload" 
                  className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
                  style={{ backgroundColor: "var(--primary-brown)", color: "#fff" }}
                >
                  <i className="bi bi-camera-fill"></i>
                </label>
                <input id="file-upload" type="file" hidden onChange={(e)=>{handleFileChange(e); setShowPhotoModal(true);}} accept="image/*" />
              </div>
              <div className="mt-2">
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowPhotoModal(true)}>
                  Change Profile Photo
                </button>
              </div>
            </div>

              <div className="row g-3 text-start">
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Full Name</label>
                <input 
                   type="text" 
                   className="form-control" 
                   value={formData.name} 
                   onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Email</label>
                <input 
                   type="email" 
                   className="form-control" 
                   value={formData.email} 
                   disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Phone</label>
                <input 
                   type="text" 
                   className="form-control" 
                   value={formData.phone} 
                   onChange={(e) => setFormData((prev) => ({...prev, phone: e.target.value}))} 
                />
              </div>
              <div className="col-12 mt-4">
                <button 
                  type="submit" 
                  className="btn w-100 fw-bold py-2 shadow-sm"
                  style={{ backgroundColor: "var(--primary-brown)", color: "var(--secondary-cream)" }}
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </form>
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
  );
}
