const Feedback = require('../models/feedback.model');
const { success, error } = require('../utils/response');

// Create feedback (farmer submits after consultation)
exports.createFeedback = async (req, res) => {
  try {
    const { consultation_id, rating, comments } = req.body;
    const farmer_id = req.user.id; // from auth middleware

    const feedback = await Feedback.create({
      consultation_id,
      farmer_id,
      rating,
      comments,
      created_at: new Date()
    });

    success(res, feedback, 'Feedback submitted successfully');
  } catch (err) {
    error(res, err.message);
  }
};

// Get feedback for a consultation (vet/farmer can view)
exports.getFeedbackByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const feedback = await Feedback.findAll({ where: { consultation_id: consultationId } });

    success(res, feedback, 'Feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

// Get all feedback by farmer
exports.getFeedbackByFarmer = async (req, res) => {
  try {
    const farmer_id = req.user.id;
    const feedback = await Feedback.findAll({ where: { farmer_id } });

    success(res, feedback, 'Farmer feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};
