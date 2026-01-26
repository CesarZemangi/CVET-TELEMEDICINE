import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { getAppointments } from "../../controllers/vet/appointments.controller.js"

const router = express.Router()

router.get("/", auth, getAppointments)

export default router
