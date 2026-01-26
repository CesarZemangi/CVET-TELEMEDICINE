import express from "express"

import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import farmerRoutes from "./farmer/index.js"
import vetRoutes from "./vet/index.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/farmer", farmerRoutes)
router.use("/vet", vetRoutes)

export default router
