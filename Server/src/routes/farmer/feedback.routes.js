import express from 'express';
const router = express.Router();

// Update these imports to match your earlier middleware fixes
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRole } from '../../middleware/role.middleware.js';
import { feedbackValidation, feedbackUpdateValidation } from '../../middleware/validation.middleware.js';
import * as feedbackController from '../../controllers/farmer/feedback.controller.js'; // ✅ Fixed

router.post('/', authenticate, authorizeRole('farmer'), feedbackValidation, feedbackController.createFeedback);
router.get('/my', authenticate, authorizeRole('farmer'), feedbackController.getFeedbackByFarmer);
router.get('/case/:case_id', authenticate, authorizeRole('farmer'), feedbackController.getFeedbackByCase);
router.put('/:id', authenticate, authorizeRole('farmer'), feedbackUpdateValidation, feedbackController.updateFeedback);

export default router; // This fixes the "does not provide an export named default" error
