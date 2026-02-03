import db from "../../config/db.js"

// Change getVetCases to getCases
export const getCases = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM cases WHERE vet_id = ?",
    [req.user.id]
  );
  res.json(rows);
};

export const assignCase = async (req, res) => {
  await db.query(
    "UPDATE cases SET vet_id = ?, status = 'assigned' WHERE id = ?",
    [req.user.id, req.params.id]
  )

  res.json({ message: "Case assigned" })
}

export const closeCase = async (req, res) => {
  await db.query(
    "UPDATE cases SET status = 'closed' WHERE id = ?",
    [req.params.id]
  )

  res.json({ message: "Case closed" })
}
