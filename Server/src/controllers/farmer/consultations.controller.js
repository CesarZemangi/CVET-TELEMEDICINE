import db from "../../config/db.js"

export const getConsultations = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM consultations WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}
