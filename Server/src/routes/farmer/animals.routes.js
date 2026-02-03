import express from "express"
import { authenticate } from "../../middleware/auth.middleware.js"
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal
} from "../../controllers/farmer/animals.controller.js"

const router = express.Router()

// Change 'auth' to 'authenticate' here:
router.get("/", authenticate, getAnimals)
router.post("/", authenticate, createAnimal)
router.put("/:id", authenticate, updateAnimal)
router.delete("/:id", authenticate, deleteAnimal)

export default router