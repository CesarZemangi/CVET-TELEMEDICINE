import express from "express";
import { getDashboardData } from "../../controllers/vet/dashboard.controller.js";

const router = express.Router();

router.get("/", getDashboardData);

export default router;
