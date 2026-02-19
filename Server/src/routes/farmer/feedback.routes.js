import express from 'express';
const router = express.Router();

// Update these imports to match your earlier middleware fixes
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRole } from '../../middleware/role.middleware.js';
import * as feedbackController from '../../controllers/farmer/feedback.controller.js'; // ✅ Fixed

router.post('/', authenticate, authorizeRole('farmer'), feedbackController.createFeedback);
router.get('/my', authenticate, authorizeRole('farmer'), feedbackController.getFeedbackByFarmer);

export default router; // This fixes the "does not provide an export named default" error