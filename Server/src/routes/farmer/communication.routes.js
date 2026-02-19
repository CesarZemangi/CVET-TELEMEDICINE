import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  getAllMessages,
  sendMessage
} from "../../controllers/communication.controller.js"

const router = express.Router()

router.get("/", auth, getAllMessages)
router.post("/", auth, sendMessage)

export default router
