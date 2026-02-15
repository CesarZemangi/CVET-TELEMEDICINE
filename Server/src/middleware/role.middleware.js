// src/middleware/role.middleware.js

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: user not found" })
    }
    
    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" })
    }
    
    next()
  }
}

// For backward compatibility if needed, but we should update usages
export const authorizeRole = (role) => authorizeRoles(role);