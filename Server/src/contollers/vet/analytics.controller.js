import db from "../../config/db.js"

export const getCaseStatistics = async (req, res) => {
  const [rows] = await db.query(
    "SELECT status, COUNT(*) count FROM cases GROUP BY status"
  )

  res.json(rows)
}
