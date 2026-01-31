import jsonwebtoken from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "your_default_secret"

// Generate a JWT token
export const generateToken = (payload) => {
  return jsonwebtoken.sign(payload, SECRET, { expiresIn: "1d" })
}

// Verify a JWT token
export const verifyToken = (token) => {
  return jsonwebtoken.verify(token, SECRET)
}
