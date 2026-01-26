import db from "../config/db.js"

export const login = async (req, res) => {
  const { email, password } = req.body

  const [rows] = await db.query(
    "SELECT id, role FROM users WHERE email = ? AND password = ?",
    [email, password]
  )

  if (!rows.length) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  res.json(rows[0])
}

export const register = async (req, res) => {
  const { name, email, password, role } = req.body

  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  )

  res.status(201).json({ message: "User created" })
}

export const logout = async (req, res) => {
  res.json({ message: "Logged out" })
}
