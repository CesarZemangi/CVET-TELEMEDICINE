const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const feedbackController = require('../controllers/feedback.controller');

router.post('/', auth, role('farmer'), feedbackController.createFeedback);
router.get('/consultation/:consultationId', auth, feedbackController.getFeedbackByConsultation);
router.get('/my-feedback', auth, role('farmer'), feedbackController.getFeedbackByFarmer);

module.exports = router;
