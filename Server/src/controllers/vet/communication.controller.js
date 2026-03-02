import db from "../../config/db.js"

export const getVetMessages = async (req, res) => {
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
