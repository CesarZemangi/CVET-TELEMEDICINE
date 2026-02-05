// src/routes/farmer/dashboard.routes.js
import express from "express";
import { getFarmerDashboard } from "../../controllers/farmer.controller.js";

const router = express.Router();

router.get("/", getFarmerDashboard);

export default router;