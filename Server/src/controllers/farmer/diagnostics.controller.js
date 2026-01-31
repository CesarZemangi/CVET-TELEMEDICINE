import db from "../../config/db.js"

export const getLabRequests = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM lab_requests WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}

export const createLabRequest = async (req, res) => {
  const { case_id, notes } = req.body

  await db.query(
    "INSERT INTO lab_requests (case_id, farmer_id, notes) VALUES (?, ?, ?)",
    [case_id, req.user.id, notes]
  )

  res.status(201).json({ message: "Lab request created" })
}

export const getLabResults = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM lab_results WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}
