import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { inventoryValidation } from "../../middleware/validation.middleware.js"
import {
  getFeedInventory,
  addFeedInventory,
  updateFeedInventory,
  deleteFeedInventory
} from "../../controllers/farmer/nutrition.controller.js"

const router = express.Router()

router.get("/feed-inventory", auth, getFeedInventory)
router.post("/feed-inventory", auth, inventoryValidation, addFeedInventory)
router.put("/feed-inventory/:id", auth, inventoryValidation, updateFeedInventory)
router.delete("/feed-inventory/:id", auth, deleteFeedInventory)

export default router
