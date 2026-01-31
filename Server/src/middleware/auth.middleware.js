import { verifyToken } from "../utils/jwt.js"

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"]
  if (!authHeader) return res.status(401).json({ error: "No token provided" })

  // Bearer token support
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

  try {
    req.user = verifyToken(token)
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
