// 1. Use import instead of require
// 2. Added .js extensions
// 3. Adjusted paths to ../../ to get out of /controllers/vet/
import Feedback from '../../models/feedback.model.js';
import { Case, Vet, User } from '../../models/associations.js';
import { success, error } from '../../utils/response.js';
import { logAction } from '../../utils/dbLogger.js';

// Get all feedback for consultations handled by the vet
export const getFeedbackForVetConsultations = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) {
      return error(res, 'Vet record not found', 404);
    }

    const feedback = await Feedback.findAll({
      where: { vet_id: vetRecord.id },
      include: [
        { 
          model: Case,
          attributes: ['id', 'title', 'description']
        },
        { 
          model: Vet,
          as: 'vet',
          attributes: ['id', 'specialization'],
          include: [{
            model: User,
            attributes: ['id', 'name', 'email']
          }]
        },
        { 
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
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
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) {
      return error(res, 'Vet record not found', 404);
    }

    const feedback = await Feedback.findAll({ 
      where: { consultation_id: consultationId, vet_id: vetRecord.id },
      include: [
        { 
          model: Case,
          attributes: ['id', 'title', 'description']
        },
        { 
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    success(res, feedback, 'Feedback for consultation retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};