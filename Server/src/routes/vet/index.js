import express from "express"

import casesRoutes from "./cases.routes.js"
import appointmentsRoutes from "./appointments.routes.js"
import consultationsRoutes from "./consultations.routes.js"
import diagnosticsRoutes from "./diagnostics.routes.js"
import treatmentRoutes from "./treatment.routes.js"
import analyticsRoutes from "./analytics.routes.js"
import communicationRoutes from "./communication.routes.js"

const router = express.Router()

router.use("/cases", casesRoutes)
router.use("/appointments", appointmentsRoutes)
router.use("/consultations", consultationsRoutes)
router.use("/diagnostics", diagnosticsRoutes)
router.use("/treatment", treatmentRoutes)
router.use("/analytics", analyticsRoutes)
router.use("/messages", communicationRoutes)

export default router
