import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { predictDisease } from "../controllers/ml.controller.js";

const router = express.Router();

router.post("/predict", authenticate, predictDisease);

export default router;
