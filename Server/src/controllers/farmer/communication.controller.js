import db from "../../config/db.js"

export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const { partner_id } = req.query

    if (!partner_id) {
      return res.status(400).json({ error: "partner_id is required" })
    }

    const [rows] = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [currentUserId, partner_id, partner_id, currentUserId]
    )

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { receiver_id, message, case_id = null } = req.body

    if (!receiver_id || !message?.trim()) {
      return res.status(400).json({ error: "receiver_id and message are required" })
    }

    await db.query(
      "INSERT INTO messages (sender_id, receiver_id, case_id, message, is_read) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, receiver_id, case_id, message.trim(), false]
    )

    res.status(201).json({ message: "Message sent" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
