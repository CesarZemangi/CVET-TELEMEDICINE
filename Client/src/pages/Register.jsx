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
    
    // Logic placeholder for your registration API call
    try {
      console.log("Registering User:", formData);
      
      // On success, we use the 'navigate' variable here
      // This clears your ESLint error and redirects the user
      alert("Registration Successful!");
      navigate("/"); 
      
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card shadow-lg">
        {/* LEFT SIDE: INSPIRATION SECTION */}
        <div 
          className="register-left" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/vet1.jpg')` 
          }}
        >
          <div className="inspiration-content text-white">
            <h1 className="fw-bold display-4">Bridging the Gap</h1>
            <p className="lead">
              Distance shouldn't define the quality of care. 
              Join a community where expert veterinary advice is just a click away from your farm.
            </p>
            <div className="social-icons mt-4">
              <i className="bi bi-twitter me-3 cursor-pointer"></i>
              <i className="bi bi-google me-3 cursor-pointer"></i>
              <i className="bi bi-facebook cursor-pointer"></i>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <div className="register-right p-5 bg-white">
          <div className="text-end mb-4">
            <span className="text-muted small me-2">Already a member?</span>
            <Link to="/" className="btn btn-outline-primary btn-sm rounded-pill px-4">Sign In</Link>
          </div>

          <h2 className="fw-bold mb-1 text-dark">Create Account</h2>
          <p className="text-muted mb-4">Start your journey with Cvet Telemedicine</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input"
                placeholder="Ex: John Doe"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input"
                placeholder="name@farm.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Password</label>
              <input
                type="password"
                name="password"
                className="form-control border-0 border-bottom rounded-0 px-0 custom-input"
                placeholder="Min. 8 characters"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
               <label className="form-label small fw-bold text-muted text-uppercase">I am registering as:</label>
               <select name="role" className="form-select border-0 border-bottom rounded-0 px-0 custom-input" onChange={handleChange}>
                  <option value="farmer">Farmer (Livestock Owner)</option>
                  <option value="vet">Veterinarian (Expert)</option>
               </select>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="terms" required />
              <label className="form-check-label small text-muted ms-1" htmlFor="terms">
                I agree to the <Link to="/terms" className="text-primary text-decoration-none fw-bold">Terms of Service</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill shadow fw-bold text-uppercase tracking-wider">
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}