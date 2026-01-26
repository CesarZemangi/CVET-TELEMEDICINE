import db from "../../config/db.js"

export const getHealthTrends = async (req, res) => {
  const [rows] = await db.query(
    "SELECT date, metric, value FROM health_metrics WHERE farmer_id = ? ORDER BY date",
    [req.user.id]
  )

  res.json(rows)
}

export const getTreatmentStats = async (req, res) => {
  const [rows] = await db.query(
    "SELECT status, COUNT(*) count FROM cases WHERE farmer_id = ? GROUP BY status",
    [req.user.id]
  )

  res.json(rows)
}
