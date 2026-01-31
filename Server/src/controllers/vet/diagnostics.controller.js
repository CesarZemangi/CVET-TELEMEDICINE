import db from "../../config/db.js"

export const createLabRequest = async (req, res) => {
  const { case_id, notes } = req.body

  await db.query(
    "INSERT INTO lab_requests (case_id, vet_id, notes) VALUES (?, ?, ?)",
    [case_id, req.user.id, notes]
  )

  res.status(201).json({ message: "Lab request created" })
}

export const uploadLabResult = async (req, res) => {
  const { case_id, result } = req.body

  await db.query(
    "INSERT INTO lab_results (case_id, vet_id, result) VALUES (?, ?, ?)",
    [case_id, req.user.id, result]
  )

  res.status(201).json({ message: "Lab result uploaded" })
}
