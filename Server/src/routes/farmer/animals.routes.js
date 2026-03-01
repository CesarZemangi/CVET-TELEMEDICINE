import express from "express"
import { authenticate } from "../../middleware/auth.middleware.js"
import { animalValidation } from "../../middleware/validation.middleware.js"
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalMedicalHistory
} from "../../controllers/farmer/animals.controller.js"

const router = express.Router()

// Middlewares are handled in app.js
router.get("/", getAnimals)
router.post("/", animalValidation, createAnimal)
router.get("/:id/medical-history", getAnimalMedicalHistory)
router.put("/:id", animalValidation, updateAnimal)
router.delete("/:id", deleteAnimal)

export default router