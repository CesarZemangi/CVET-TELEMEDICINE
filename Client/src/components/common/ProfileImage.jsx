import React, { useEffect, useMemo, useState } from 'react';
import { getFileUrl } from '../../utils';

export default function ProfileImage({ src, role, name = "", size = "40px", className = "" }) {
  
  // Choose the default based on the role
  const getDefaultAvatar = () => {
    if (role === 'vet') return "/assets/vet.jpeg";
    if (role === 'farmer') return "/assets/fam.jpeg";
    if (role === 'admin') return "/assets/admin.jpg";
    return "/assets/fam.jpeg"; // Default fallback
  };

  const defaultAvatar = getDefaultAvatar();
  const buildSrc = (value) => {
    if (!value) return defaultAvatar;
    const separator = String(value).includes("?") ? "&" : "?";
    return `${getFileUrl(value)}${separator}v=${encodeURIComponent(String(value))}`;
  };

  const initialImagePath = buildSrc(src);
  const [imagePath, setImagePath] = useState(initialImagePath);
  const [failedDefault, setFailedDefault] = useState(false);

  useEffect(() => {
    setImagePath(buildSrc(src));
    setFailedDefault(false);
  }, [src, role, defaultAvatar]);

  const initials = useMemo(() => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    const chars = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
    return chars.join("") || "U";
  }, [name]);

  return (
    <div 
      className={`rounded-circle overflow-hidden border border-2 border-white border-opacity-25 ${className}`}
      style={{ width: size, height: size, flexShrink: 0, background: "#e9ecef" }}
    >
      {!failedDefault ? (
        <img
          src={imagePath}
          alt="Profile"
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          onError={() => {
            if (imagePath !== defaultAvatar) {
              setImagePath(defaultAvatar);
              return;
            }
            setFailedDefault(true);
          }}
        />
      ) : (
        <div
          className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold text-secondary"
          style={{ fontSize: "0.8rem" }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
