import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getFarmerVetRecommendations, getPaymentInsights, predictDisease } from "../controllers/ml.controller.js";

const router = express.Router();

router.post("/predict", authenticate, predictDisease);
router.get("/payment-insights", authenticate, getPaymentInsights);
router.get("/vet-recommendations", authenticate, getFarmerVetRecommendations);

export default router;
