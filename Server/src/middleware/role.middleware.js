// src/middleware/role.middleware.js

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: user not found" })
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" })
    }
    next()
  }
}

export default authorizeRole
