import React, { useMemo, useState, useEffect } from 'react';
import { getFileUrl } from '../../utils';

export default function ProfileImage({ src, role, name = "", size = "40px", className = "", cacheKey = null }) {
  
  // Choose the default based on the role
  const withCache = (url) => {
    if (!cacheKey) return url;
    if (!url) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}v=${cacheKey}`;
  };

  const defaultAvatar = useMemo(() => {
    const r = String(role || "").toLowerCase();
    if (r === 'vet') return withCache("/assets/vet.jpeg");
    if (r === 'farmer') return withCache("/assets/fam.jpeg");
    if (r === 'admin') return withCache("/assets/admin.jpg");
    return withCache("/assets/fam.jpeg"); // Default fallback
  }, [role, cacheKey]);

  const [imagePath, setImagePath] = useState(defaultAvatar);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) {
      setImagePath(defaultAvatar);
      setFailed(false);
      return;
    }

    const valStr = String(src);
    if (valStr.startsWith("blob:") || valStr.startsWith("data:")) {
      setImagePath(valStr);
    } else {
      // If src already has a timestamp, we don't strictly need another one here,
      // but adding one ensures that if the server returns the same path, it refreshes.
      const baseUrl = getFileUrl(src);
      const separator = baseUrl.includes("?") ? "&" : "?";
      const busted = `${baseUrl}${separator}t=${Date.now()}`;
      setImagePath(withCache(busted));
    }
    setFailed(false);
  }, [src, defaultAvatar]);

  const initials = useMemo(() => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    const chars = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
    return chars.join("") || "U";
  }, [name]);

  const handleError = () => {
    if (imagePath !== defaultAvatar) {
      setImagePath(defaultAvatar);
    } else {
      setFailed(true);
    }
  };

  return (
    <div 
      className={`rounded-circle overflow-hidden border border-2 border-white border-opacity-25 ${className}`}
      style={{ width: size, height: size, flexShrink: 0, background: "#e9ecef" }}
    >
      {!failed && imagePath ? (
        <img
          src={imagePath}
          alt="Profile"
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          onError={handleError}
        />
      ) : (
        <div
          className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold text-secondary"
          style={{ fontSize: `calc(${size} / 3)` }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
