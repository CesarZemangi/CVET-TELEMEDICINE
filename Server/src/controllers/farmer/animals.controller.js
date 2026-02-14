import Animal from "../../models/animal.model.js"
import { success, error } from "../../utils/response.js"

export const getAnimals = async (req, res) => {
  try {
    const rows = await Animal.findAll({
      where: { farmer_id: req.user.id }
    })

    success(res, rows, "Animals fetched")
  } catch (err) {
    error(res, err.message)
  }
}

export const createAnimal = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body

    const animal = await Animal.create({
      farmer_id: req.user.id,
      tag_number: name, // Using 'name' as tag_number as per existing logic
      species,
      breed,
      age
    })

    success(res, animal, "Animal added")
  } catch (err) {
    error(res, err.message)
  }
}

export const updateAnimal = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body

    await Animal.update({
      tag_number: name,
      species,
      breed,
      age
    }, {
      where: { id: req.params.id, farmer_id: req.user.id }
    })

    success(res, null, "Animal updated")
  } catch (err) {
    error(res, err.message)
  }
}

export const deleteAnimal = async (req, res) => {
  try {
    await Animal.destroy({
      where: { id: req.params.id, farmer_id: req.user.id }
    })

    success(res, null, "Animal deleted")
  } catch (err) {
    error(res, err.message)
  }
}
