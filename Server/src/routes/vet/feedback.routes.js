const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const feedbackVetController = require('../controllers/feedbackVet.controller');

router.get('/consultations', auth, role('vet'), feedbackVetController.getFeedbackForVetConsultations);
router.get('/consultation/:consultationId', auth, role('vet'), feedbackVetController.getFeedbackByConsultation);

module.exports = router;
