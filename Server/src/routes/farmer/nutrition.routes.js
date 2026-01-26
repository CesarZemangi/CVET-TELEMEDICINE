import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getFeedInventory,
  addFeedInventory
} from "../../controllers/farmer/nutrition.controller.js"

const router = express.Router()

router.get("/feed-inventory", auth, getFeedInventory)
router.post("/feed-inventory", auth, addFeedInventory)

export default router
