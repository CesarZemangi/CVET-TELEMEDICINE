import db from "../../config/db.js"

export const getCases = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM cases WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}

export const createCase = async (req, res) => {
  const { animal_id, description } = req.body

  await db.query(
    "INSERT INTO cases (farmer_id, animal_id, description, status) VALUES (?, ?, ?, 'open')",
    [req.user.id, animal_id, description]
  )

  res.status(201).json({ message: "Case created" })
}

export const getCaseById = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM cases WHERE id = ? AND farmer_id = ?",
    [req.params.id, req.user.id]
  )

  res.json(rows[0])
}
