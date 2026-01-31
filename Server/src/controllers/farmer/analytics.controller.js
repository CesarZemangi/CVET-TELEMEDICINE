import db from "../../config/db.js"
import { success, error } from "../../utils/response.js"

export const getHealthTrends = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT date, metric, value FROM health_metrics WHERE farmer_id = ? ORDER BY date",
      [req.user.id]
    )

    success(res, rows, "Health trends fetched")
  } catch (err) {
    error(res, err.message)
  }
}

export const getTreatmentStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT status, COUNT(*) AS count FROM cases WHERE farmer_id = ? GROUP BY status",
      [req.user.id]
    )

    success(res, rows, "Treatment statistics fetched")
  } catch (err) {
    error(res, err.message)
  }
}
