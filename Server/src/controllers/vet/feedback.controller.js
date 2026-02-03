// 1. Use import instead of require
// 2. Added .js extensions
// 3. Adjusted paths to ../../ to get out of /controllers/vet/
import Feedback from '../../models/feedback.model.js';
import { success, error } from '../../utils/response.js';

// Get all feedback for consultations handled by the vet
export const getFeedbackForVetConsultations = async (req, res) => {
  try {
    const vet_id = req.user.id; // populated by authenticate middleware

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
export const getFeedbackByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const feedback = await Feedback.findAll({ 
      where: { consultation_id: consultationId } 
    });

    success(res, feedback, 'Feedback for consultation retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};