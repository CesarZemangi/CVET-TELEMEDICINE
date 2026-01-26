import db from "../../config/db.js"

export const getAnimals = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM animals WHERE farmer_id = ?",
    [req.user.id]
  )

  res.json(rows)
}

export const createAnimal = async (req, res) => {
  const { name, species, age } = req.body

  await db.query(
    "INSERT INTO animals (farmer_id, name, species, age) VALUES (?, ?, ?, ?)",
    [req.user.id, name, species, age]
  )

  res.status(201).json({ message: "Animal added" })
}

export const updateAnimal = async (req, res) => {
  const { name, species, age } = req.body

  await db.query(
    "UPDATE animals SET name = ?, species = ?, age = ? WHERE id = ? AND farmer_id = ?",
    [name, species, age, req.params.id, req.user.id]
  )

  res.json({ message: "Animal updated" })
}

export const deleteAnimal = async (req, res) => {
  await db.query(
    "DELETE FROM animals WHERE id = ? AND farmer_id = ?",
    [req.params.id, req.user.id]
  )

  res.json({ message: "Animal deleted" })
}
