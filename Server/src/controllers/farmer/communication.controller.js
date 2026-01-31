import db from "../../config/db.js"

export const getMessages = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM messages WHERE farmer_id = ? ORDER BY created_at DESC",
    [req.user.id]
  )

  res.json(rows)
}

export const sendMessage = async (req, res) => {
  const { vet_id, message } = req.body

  await db.query(
    "INSERT INTO messages (farmer_id, vet_id, message) VALUES (?, ?, ?)",
    [req.user.id, vet_id, message]
  )

  res.status(201).json({ message: "Message sent" })
}
