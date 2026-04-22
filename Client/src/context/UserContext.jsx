import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const [version, setVersion] = useState(Date.now());

  const refreshFromStorage = useCallback(() => {
    try {
      const latest = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(latest);
      setVersion(Date.now());
    } catch {
      setUser({});
      setVersion(Date.now());
    }
  }, []);

  // Listen for manual storage changes (other tabs / storage events)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") refreshFromStorage();
    };
    const onUserUpdated = () => refreshFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("user-updated", onUserUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-updated", onUserUpdated);
    };
  }, [refreshFromStorage]);

  // Replace user wholesale (legacy API)
  const persistUser = useCallback((nextUser) => {
    const safeUser = nextUser || {};
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
    setVersion(Date.now());
    window.dispatchEvent(new Event("user-updated"));
  }, []);

  // Merge new fields into the current user and bump version for cache-busting (e.g., profile pictures)
  const updateUserInfo = useCallback((newData = {}) => {
    setUser((prev = {}) => {
      const merged = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
    setVersion(Date.now());
    window.dispatchEvent(new Event("user-updated"));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: persistUser, updateUserInfo, version, refreshFromStorage }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
