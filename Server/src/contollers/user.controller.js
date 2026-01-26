import db from "../config/db.js"

export const getMe = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [req.user.id]
  )

  res.json(rows[0])
}

export const updateMe = async (req, res) => {
  const { name, email } = req.body

  await db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.user.id]
  )

  res.json({ message: "Profile updated" })
}
