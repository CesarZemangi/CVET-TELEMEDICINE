import React, { useState } from "react";
import ProfileImage from "../components/common/ProfileImage";
import api from "../services/api";

export default function ProfileSettings() {
  // Load initial state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (selectedFile) data.append("profile_image", selectedFile);

    try {
      const res = await api.put(`/user/profile`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = {
        ...user,
        ...res.data.user
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));
      
      alert("Profile updated successfully!");
      setPreview(null); // Clear preview once saved
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error updating profile.");
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
                  <ProfileImage src={user.profile_image} role={user.role} size="120px" />
                )}
                
                <label 
                  htmlFor="file-upload" 
                  className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle shadow"
                  style={{ backgroundColor: "var(--primary-brown)", color: "#fff" }}
                >
                  <i className="bi bi-camera-fill"></i>
                </label>
                <input id="file-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
              </div>
            </div>

            <div className="row g-3 text-start">
              <div className="col-md-12">
                <label className="form-label small fw-bold">Full Name</label>
                <input 
                   type="text" 
                   className="form-control" 
                   value={formData.name} 
                   onChange={(e) => setFormData({...formData, name: e.target.value})} 
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
                   onChange={(e) => setFormData({...formData, phone: e.target.value})} 
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
    </div>
  );
}
