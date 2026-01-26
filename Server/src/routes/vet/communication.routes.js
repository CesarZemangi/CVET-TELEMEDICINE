import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getVetMessages } from "../../controllers/vet/communication.controller.js"

const router = express.Router()

router.get("/", auth, getVetMessages)

export default router
