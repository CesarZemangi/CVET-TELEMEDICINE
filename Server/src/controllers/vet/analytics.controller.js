import { Case, Vet, User, Message, Consultation } from "../../models/associations.js";
import LabRequest from "../../models/labRequest.model.js";
import Feedback from "../../models/feedback.model.js";
import MedicationHistory from "../../models/medicationHistory.model.js";
import { fn, col } from "sequelize";

export const getCaseStatistics = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) {
      return res.status(404).json({ error: "Vet profile not found" });
    }

    const caseStatistics = await Case.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where: { vet_id: vetRecord.id },
      group: ['status'],
      raw: true
    });

    res.json(caseStatistics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyPerformance = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ 
      where: { user_id: req.user.id },
      include: [{ model: User, attributes: ['id', 'name'] }]
    });
    
    if (!vetRecord) {
      return res.status(404).json({ error: "Vet profile not found" });
    }

    const vetUserId = vetRecord.User.id;
    const vetId = vetRecord.id;

    // Total cases assigned
    const totalAssigned = await Case.count({ where: { vet_id: vetId } });

    // Closed cases
    const completedCases = await Case.count({ 
      where: { vet_id: vetId, status: 'closed' } 
    });

    // Open cases
    const activeCases = await Case.count({ 
      where: { vet_id: vetId, status: 'open' } 
    });

    // Average resolution time (in hours)
    let avgResolutionHours = 0;
    try {
      const resolutionQuery = `
        SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, COALESCE(closed_at, NOW()))) as avg_hours
        FROM cases
        WHERE vet_id = ? AND status = 'closed'
      `;
      const resolutionData = await Case.sequelize.query(resolutionQuery, {
        replacements: [vetId],
        type: 'SELECT'
      });
      avgResolutionHours = Math.round(resolutionData?.[0]?.avg_hours || 0);
    } catch (e) {
      avgResolutionHours = 0;
    }

    // Average feedback rating
    const feedbackData = await Feedback.findOne({
      attributes: [
        [fn('AVG', col('rating')), 'avg_rating'],
        [fn('COUNT', col('id')), 'feedback_count']
      ],
      where: { vet_id: vetId },
      raw: true
    });
    const avgRating = feedbackData?.avg_rating ? parseFloat(feedbackData.avg_rating).toFixed(2) : 0;
    const feedbackCount = feedbackData?.feedback_count || 0;

    // Total lab requests created
    const totalLabRequests = await LabRequest.count({
      where: { vet_id: vetId }
    });

    // Total prescriptions (medications) created
    const totalPrescriptions = await MedicationHistory.count({
      where: { vet_id: vetId }
    });

    // Total consultations
    const totalConsultations = await Consultation.count({
      where: { vet_id: vetId }
    });

    // Average response time (time from case creation to first vet message in minutes)
    let avgResponseTime = 0;
    try {
      const responseTimeQuery = `
        SELECT AVG(TIMESTAMPDIFF(MINUTE, c.created_at, m.created_at)) as avg_response_minutes
        FROM (
          SELECT case_id, MIN(created_at) as first_message_time
          FROM messages
          WHERE sender_id = ? AND case_id IS NOT NULL
          GROUP BY case_id
        ) as m
        JOIN cases c ON m.case_id = c.id
        WHERE c.vet_id = ?
      `;
      const responseTimeResults = await Case.sequelize.query(responseTimeQuery, {
        replacements: [vetUserId, vetId],
        type: 'SELECT'
      });
      avgResponseTime = Math.round(responseTimeResults?.[0]?.avg_response_minutes || 0);
    } catch (e) {
      avgResponseTime = 0;
    }

    // Case closure rate percentage
    const caseClosureRate = totalAssigned > 0 ? ((completedCases / totalAssigned) * 100).toFixed(2) : 0;

    res.json({
      name: vetRecord.User.name,
      specialization: vetRecord.specialization || 'N/A',
      performance: {
        totalAssigned,
        completedCases,
        activeCases,
        caseClosureRate: parseFloat(caseClosureRate),
        avgResolutionHours,
        avgResponseTime,
        avgRating: parseFloat(avgRating),
        feedbackCount,
        totalLabRequests,
        totalPrescriptions,
        totalConsultations
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
