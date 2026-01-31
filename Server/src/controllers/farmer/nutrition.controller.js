import db from "../../config/db.js"

export const getFeedInventory = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM feed_inventory WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}

export const addFeedInventory = async (req, res) => {
  const { feed_name, quantity, unit } = req.body

  await db.query(
    "INSERT INTO feed_inventory (farmer_id, feed_name, quantity, unit) VALUES (?, ?, ?, ?)",
    [req.user.id, feed_name, quantity, unit]
  )

  res.status(201).json({ message: "Feed added" })
}
