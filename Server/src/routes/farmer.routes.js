import express from "express";
// IMPORTANT: Path must include the .js extension for ES Modules
import { 
    getFarmerDashboard, 
    getLivestock 
} from "../controllers/farmer.controller.js";

const router = express.Router();

/**
 * All routes here are relative to the path defined in your main app.js 
 * (Usually /api/farmer)
 */

// GET /api/farmer/dashboard
router.get("/dashboard", getFarmerDashboard);

// GET /api/farmer/livestock
router.get("/livestock", getLivestock);

export default router;