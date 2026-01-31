import db from "../../config/db.js"
import { success, error } from "../../utils/response.js"

export const getAnimals = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM animals WHERE farmer_id = ?",
      [req.user.id]
    )

    success(res, rows, "Animals fetched")
  } catch (err) {
    error(res, err.message)
  }
}

export const createAnimal = async (req, res) => {
  try {
    const { name, species, age } = req.body

    await db.query(
      "INSERT INTO animals (farmer_id, name, species, age) VALUES (?, ?, ?, ?)",
      [req.user.id, name, species, age]
    )

    success(res, null, "Animal added")
  } catch (err) {
    error(res, err.message)
  }
}

export const updateAnimal = async (req, res) => {
  try {
    const { name, species, age } = req.body

    await db.query(
      "UPDATE animals SET name = ?, species = ?, age = ? WHERE id = ? AND farmer_id = ?",
      [name, species, age, req.params.id, req.user.id]
    )

    success(res, null, "Animal updated")
  } catch (err) {
    error(res, err.message)
  }
}

export const deleteAnimal = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM animals WHERE id = ? AND farmer_id = ?",
      [req.params.id, req.user.id]
    )

    success(res, null, "Animal deleted")
  } catch (err) {
    error(res, err.message)
  }
}
