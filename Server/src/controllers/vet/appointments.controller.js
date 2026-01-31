import db from "../../config/db.js"

export const getAppointments = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM appointments WHERE vet_id = ?",
    [req.user.id]
  )

  res.json(rows)
}
