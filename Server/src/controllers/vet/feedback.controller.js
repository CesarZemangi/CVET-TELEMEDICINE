const Feedback = require('../models/feedback.model');
const { success, error } = require('../utils/response');

// Get all feedback for consultations handled by the vet
exports.getFeedbackForVetConsultations = async (req, res) => {
  try {
    const vet_id = req.user.id; // from auth middleware

    const feedback = await Feedback.findAll({
      include: [{
        association: 'Consultation',
        where: { vet_id }
      }]
    });

    success(res, feedback, 'Feedback for your consultations retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

// Get feedback details by consultation (vet-specific)
exports.getFeedbackByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const feedback = await Feedback.findAll({ where: { consultation_id: consultationId } });

    success(res, feedback, 'Feedback for consultation retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};
