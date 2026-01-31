import db from "../config/db.js"
import bcrypt from "bcryptjs"

// REGISTER
export const register = async (req, res) => {
  const { name, email, password, role, phone } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All required fields must be filled" })
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" })
    }

    const password_hash = await bcrypt.hash(password, 10)

    await db.query(
      "INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)",
      [name, email, password_hash, role, phone || null]
    )

    return res.status(201).json({ message: "Registration successful" })
  } catch (err) {
    console.error("Register error:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" })
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, email, password_hash, role, phone FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password_hash)

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Login failed" })
  }
}

// LOGOUT
export const logout = (req, res) => {
  return res.status(200).json({ message: "Logout successful" })
}
