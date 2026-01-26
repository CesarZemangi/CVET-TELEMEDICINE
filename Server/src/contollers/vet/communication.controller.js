import db from "../../config/db.js"

export const getVetMessages = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM messages WHERE vet_id = ? ORDER BY created_at DESC",
    [req.user.id]
  )

  res.json(rows)
}
