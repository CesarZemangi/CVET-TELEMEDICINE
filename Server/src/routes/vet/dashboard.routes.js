import express from "express";
import { getDashboardData, getRecentActivity } from "../../controllers/vet/dashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getDashboardData);
router.get("/activity", authenticate, getRecentActivity);

export default router;
