import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal
} from "../../controllers/farmer/animals.controller.js"

const router = express.Router()

router.get("/", auth, getAnimals)
router.post("/", auth, createAnimal)
router.put("/:id", auth, updateAnimal)
router.delete("/:id", auth, deleteAnimal)

export default router
