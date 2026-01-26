import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getMessages,
  sendMessage
} from "../../controllers/farmer/communication.controller.js"

const router = express.Router()

router.get("/", auth, getMessages)
router.post("/", auth, sendMessage)

export default router
