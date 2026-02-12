import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      alert("Registration successful. Please log in.");
      navigate("/");

    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.message);
    }
  };

  return (
    <div 
      className="register-container d-flex align-items-center justify-content-center vh-100" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.7), rgba(34, 139, 34, 0.5)), url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=2070')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px'
      }}
    >
      <div className="register-card shadow-lg border-0 overflow-hidden d-flex" style={{ borderRadius: '25px', maxWidth: '820px', width: '100%', minHeight: '550px', backgroundColor: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(10px)' }}>
        {/* LEFT SIDE: BRANDING SECTION */}
        <div 
          className="register-left d-none d-md-flex align-items-center justify-content-center text-white p-4" 
          style={{ 
            background: "linear-gradient(180deg, rgba(34, 139, 34, 0.95) 0%, rgba(30, 144, 255, 0.95) 100%)",
            width: '35%'
          }}
        >
          <div className="text-center">
            <h2 className="fw-bold mb-3 display-6">CVET Portal</h2>
            <p className="opacity-90 small px-2">
              Expert veterinary advice is just a click away from your farm.
            </p>
            <div className="mt-4">
               <i className="bi bi-shield-check" style={{ fontSize: '2.5rem' }}></i>
               <p className="mt-2 small text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Trusted Care</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <div className="register-right p-4 p-lg-5 flex-grow-1">
          <div className="text-end mb-3">
            <span className="text-muted small me-2">Already a member?</span>
            <Link to="/" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold" style={{ fontSize: '0.75rem' }}>Sign In</Link>
          </div>

          <h3 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>Create Account</h3>
          <p className="text-muted mb-4 small">Join the Cvet Telemedicine community</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input bg-transparent"
                placeholder="Ex: John Doe"
                onChange={handleChange}
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input bg-transparent"
                placeholder="name@farm.com"
                onChange={handleChange}
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>Password</label>
              <input
                type="password"
                name="password"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input bg-transparent"
                placeholder="Min. 8 characters"
                onChange={handleChange}
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div className="mb-4">
               <label className="form-label small fw-bold text-muted text-uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>I am registering as:</label>
               <select name="role" className="form-select border-0 border-bottom rounded-0 px-0 custom-input bg-transparent" onChange={handleChange} style={{ fontSize: '0.9rem' }}>
                  <option value="farmer">Farmer (Livestock Owner)</option>
                  <option value="vet">Veterinarian (Expert)</option>
               </select>
            </div>

            <button 
              type="submit" 
              className="btn w-100 py-2 rounded-pill shadow-sm fw-bold text-uppercase tracking-wider border-0 text-white"
              style={{ 
                background: "linear-gradient(180deg, #228B22 0%, #1E90FF 100%)",
                fontSize: '0.85rem'
              }}
            >
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
