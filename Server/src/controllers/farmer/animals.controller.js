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
    const { tag_number, species, breed, age, health_status } = req.body

    const animal = await Animal.create({
      farmer_id: req.user.id,
      tag_number,
      species,
      breed,
      age,
      health_status: health_status || 'healthy',
      created_by: req.user.id,
      updated_by: req.user.id
    })

    success(res, animal, "Animal added")
  } catch (err) {
    error(res, err.message)
  }
}

export const updateAnimal = async (req, res) => {
  try {
    const { tag_number, species, breed, age, health_status } = req.body

    await Animal.update({
      tag_number,
      species,
      breed,
      age,
      health_status,
      updated_by: req.user.id
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
