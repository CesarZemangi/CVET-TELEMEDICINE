import express from "express"

import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import farmerRoutes from "./farmer/index.js"
import vetRoutes from "./vet/index.js"
import adminRoutes from "./admin.routes.js"
import communicationRoutes from "./communication.routes.js"
import animalRoutes from "./animals.routes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/farmer", farmerRoutes)
router.use("/vet", vetRoutes)
router.use("/admin", adminRoutes)
router.use("/communication", communicationRoutes)
router.use("/animals", animalRoutes)

export default router
