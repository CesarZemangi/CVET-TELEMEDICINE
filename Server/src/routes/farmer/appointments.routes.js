import express from "express"
import auth from "../../middleware/auth.middleware.js"
import {
  createAppointmentRequest,
  getFarmerAppointments,
  cancelAppointment,
  getCasesForAppointments,
  getVetsForAppointments
} from "../../controllers/farmer/appointments.controller.js"

const router = express.Router()

router.get("/cases", auth, getCasesForAppointments)
router.get("/vets", auth, getVetsForAppointments)
router.post("/", auth, createAppointmentRequest)
router.get("/", auth, getFarmerAppointments)
router.put("/:id/cancel", auth, cancelAppointment)

export default router
