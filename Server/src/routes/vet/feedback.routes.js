import express from 'express';
const router = express.Router();

// From src/routes/vet/feedback.routes.js:
// ../ takes you to src/routes/
// ../../ takes you to src/
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRole } from '../../middleware/role.middleware.js';
import * as feedbackVetController from '../../controllers/vet/feedback.controller.js';

// 4. Update the route definitions with the new middleware names
router.get('/consultations', authenticate, authorizeRole('vet'), feedbackVetController.getFeedbackForVetConsultations);
router.get('/consultation/:consultationId', authenticate, authorizeRole('vet'), feedbackVetController.getFeedbackByConsultation);

export default router;