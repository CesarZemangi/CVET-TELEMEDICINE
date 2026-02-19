import express from "express";
import { getDashboardData, getRecentActivity } from "../../controllers/vet/dashboard.controller.js";

const router = express.Router();

router.get("/", getDashboardData);
router.get("/activity", getRecentActivity);

export default router;
