import db from "../../config/db.js"

export const getPrescriptions = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM prescriptions WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}

export const getTreatmentPlans = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM treatment_plans WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}
