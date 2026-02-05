import React, { useState } from "react";
import ProfileImage from "../components/common/ProfileImage";
import axios from "axios";

export default function ProfileSettings() {
  // Load initial state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || ""
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
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    if (selectedFile) data.append("profilePic", selectedFile);

    try {
      // Use your specific Backend API URL here
      const res = await axios.put(`http://localhost:5000/api/users/profile/${user._id}`, data);
      
      // 1. Update the Local State (This uses 'setUser', fixing the error)
      setUser(res.data.user);
      
      // 2. Update LocalStorage so the Sidebar stays updated
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
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
                  <ProfileImage src={user.profilePic} role={user.role} size="120px" />
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
              <div className="col-md-6">
                <label className="form-label small fw-bold">First Name</label>
                <input 
                   type="text" 
                   className="form-control" 
                   value={formData.firstName} 
                   onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Last Name</label>
                <input 
                   type="text" 
                   className="form-control" 
                   value={formData.lastName} 
                   onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
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