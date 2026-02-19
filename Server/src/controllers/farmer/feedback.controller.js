import { Feedback, Case } from '../../models/associations.js'; 
import { success, error } from '../../utils/response.js';

export const createFeedback = async (req, res) => {
  try {
    const { case_id, consultation_id, rating, comments } = req.body;
    const farmer_id = req.user.id; 

    if (!case_id || !rating || !comments) {
      return res.status(400).json({ error: "case_id, rating and comments are required" });
    }

    // Find the case to get vet_id
    const singleCase = await Case.findOne({
      where: { id: case_id, farmer_id }
    });

    if (!singleCase) {
      return res.status(404).json({ error: "Case not found or does not belong to you" });
    }

    const feedback = await Feedback.create({
      case_id,
      consultation_id: consultation_id || null,
      vet_id: singleCase.vet_id,
      farmer_id,
      rating,
      comments,
      created_by: farmer_id,
      updated_by: farmer_id
    });

    success(res, feedback, 'Feedback submitted successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const getFeedbackByCase = async (req, res) => {
  try {
    const { case_id } = req.params;
    const feedback = await Feedback.findAll({ where: { case_id } });
    success(res, feedback, 'Feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const getFeedbackByFarmer = async (req, res) => {
  try {
    const farmer_id = req.user.id;
    const feedback = await Feedback.findAll({ 
      where: { farmer_id },
      include: [{ model: Case, attributes: ['title'] }]
    });
    success(res, feedback, 'Farmer feedback retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};