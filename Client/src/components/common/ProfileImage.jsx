import React from 'react';

export default function ProfileImage({ src, role, size = "40px", className = "" }) {
  const serverBaseUrl = "http://localhost:5000/uploads/profiles/";
  
  // Choose the default based on the role
  const getDefaultAvatar = () => {
    if (role === 'vet') return "/assets/vet.jpeg";
    if (role === 'farmer') return "/assets/fam.jpeg";
    if (role === 'admin') return "/assets/admin.jpg";
    return "/assets/fam.jpeg"; // Default fallback
  };

  const defaultAvatar = getDefaultAvatar();
  const imagePath = (src && src !== "") ? `${serverBaseUrl}${src}` : defaultAvatar;

  return (
    <div 
      className={`rounded-circle overflow-hidden border border-2 border-white border-opacity-25 ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <img
        src={imagePath}
        alt="Profile"
        className="w-100 h-100"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
      />
    </div>
  );
}