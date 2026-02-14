import express from "express"
import { authenticate } from "../../middleware/auth.middleware.js"
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal
} from "../../controllers/farmer/animals.controller.js"

const router = express.Router()

// Middlewares are handled in app.js
router.get("/", getAnimals)
router.post("/", createAnimal)
router.put("/:id", updateAnimal)
router.delete("/:id", deleteAnimal)

export default router