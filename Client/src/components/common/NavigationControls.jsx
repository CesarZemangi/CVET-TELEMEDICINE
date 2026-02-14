import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavigationControls() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const goToDashboard = () => {
    const role = user?.role;
    if (role === 'admin') navigate('/admindashboard');
    else if (role === 'vet') navigate('/vetdashboard');
    else navigate('/farmerdashboard');
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-4 d-flex flex-column gap-2" style={{ zIndex: 1050 }}>
      {/* Scroll to Top */}
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: '45px', height: '45px' }}
          title="Scroll to Top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      {/* Back to Dashboard */}
      <button 
        onClick={goToDashboard}
        className="btn btn-dark rounded-pill shadow-lg px-3 d-flex align-items-center gap-2"
        style={{ height: '45px' }}
        title="Back to Dashboard"
      >
        <i className="bi bi-speedometer2"></i>
        <span className="small fw-bold d-none d-md-inline">Dashboard</span>
      </button>
    </div>
  );
}
