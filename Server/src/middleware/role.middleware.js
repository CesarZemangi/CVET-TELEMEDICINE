// src/middleware/role.middleware.js

// Add 'export' here and remove 'default' from the bottom
export function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: user not found" })
    }
    
    // Check if the user's role matches the required role
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" })
    }
    
    next()
  }
}