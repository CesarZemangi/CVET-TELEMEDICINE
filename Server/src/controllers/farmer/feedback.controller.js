// Change 'require' to 'import'
import Feedback from '../../models/feedback.model.js'; 
import { success, error } from '../../utils/response.js';

// Change 'exports.name' to 'export const name'
export const createFeedback = async (req, res) => {
  try {
    const { consultation_id, rating, comments } = req.body;
    const farmer_id = req.user.id; 

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

export const getFeedbackByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const feedback = await Feedback.findAll({ where: { consultation_id: consultationId } });

    success(res, feedback, 'Feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const getFeedbackByFarmer = async (req, res) => {
  try {
    const farmer_id = req.user.id;
    const feedback = await Feedback.findAll({ where: { farmer_id } });

    success(res, feedback, 'Farmer feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};