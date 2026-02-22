import { User, Case, Message, PreventiveReminder, Vet, Consultation } from "../../models/associations.js";
import LabRequest from "../../models/labRequest.model.js";
import Feedback from "../../models/feedback.model.js";
import MedicationHistory from "../../models/medicationHistory.model.js";
import { fn, col, Op, literal } from "sequelize";

export const getOverviewAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalFarmers = await User.count({ where: { role: 'farmer' } });
    const totalVets = await User.count({ where: { role: 'vet' } });
    
    const casesByStatus = await Case.findAll({
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status']
    });

    const casesByPriority = await Case.findAll({
      attributes: ['priority', [fn('count', col('id')), 'count']],
      group: ['priority']
    });

    res.json({
      totalUsers,
      totalFarmers,
      totalVets,
      casesByStatus,
      casesByPriority
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCaseAnalytics = async (req, res) => {
  try {
    const monthlyCases = await Case.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']]
    });

    const priorityDistribution = await Case.findAll({
      attributes: ['priority', [fn('count', col('id')), 'count']],
      group: ['priority']
    });

    res.json({
      monthlyCases,
      priorityDistribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessageAnalytics = async (req, res) => {
  try {
    const dailyMessages = await Message.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      limit: 30
    });

    res.json({
      dailyMessages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReminderAnalytics = async (req, res) => {
  try {
    const monthlyReminders = await PreventiveReminder.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('reminder_date'), '%Y-%m'), 'month'],
        [fn('count', col('id')), 'count']
      ],
      where: { status: 'sent' },
      group: [fn('DATE_FORMAT', col('reminder_date'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('reminder_date'), '%Y-%m'), 'ASC']]
    });

    const successRate = await PreventiveReminder.findAll({
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status']
    });

    res.json({
      monthlyReminders,
      successRate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVetPerformance = async (req, res) => {
    try {
        const vets = await Vet.findAll({
            attributes: ['id', 'specialization'],
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });

        const performanceMetrics = await Promise.all(vets.map(async (vet) => {
            const vetUserId = vet.User.id;

            // Total cases assigned
            const totalAssigned = await Case.count({ where: { vet_id: vet.id } });

            // Closed cases
            const completedCases = await Case.count({ 
                where: { vet_id: vet.id, status: 'closed' } 
            });

            // Open cases
            const activeCases = await Case.count({ 
                where: { vet_id: vet.id, status: 'open' } 
            });

            // Average resolution time (in hours) - from case creation to closed_at
            let avgResolutionHours = 0;
            try {
                const resolutionQuery = `
                    SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, COALESCE(closed_at, NOW()))) as avg_hours
                    FROM cases
                    WHERE vet_id = ? AND status = 'closed'
                `;
                const resolutionData = await Case.sequelize.query(resolutionQuery, {
                    replacements: [vet.id],
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
                where: {
                    vet_id: vet.id
                },
                raw: true
            });
            const avgRating = feedbackData?.avg_rating ? parseFloat(feedbackData.avg_rating).toFixed(2) : 0;
            const feedbackCount = feedbackData?.feedback_count || 0;

            // Total lab requests created by vet
            const totalLabRequests = await LabRequest.count({
                where: { vet_id: vet.id }
            });

            // Total prescriptions (medications) created by vet
            const totalPrescriptions = await MedicationHistory.count({
                where: { vet_id: vet.id }
            });

            // Total consultations
            const totalConsultations = await Consultation.count({
                where: { vet_id: vet.id }
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
                    replacements: [vetUserId, vet.id],
                    type: 'SELECT'
                });
                avgResponseTime = Math.round(responseTimeResults?.[0]?.avg_response_minutes || 0);
            } catch (e) {
                avgResponseTime = 0;
            }

            // Closed case rate percentage
            const caseClosureRate = totalAssigned > 0 ? ((completedCases / totalAssigned) * 100).toFixed(2) : 0;

            return {
                vet_id: vet.id,
                name: vet.User.name,
                specialization: vet.specialization || 'N/A',
                totalAssigned,
                completedCases,
                activeCases,
                caseClosureRate: parseFloat(caseClosureRate),
                avgResolutionHours: Math.round(avgResolutionHours),
                avgResponseTime: Math.round(avgResponseTime),
                avgRating: parseFloat(avgRating),
                feedbackCount,
                totalLabRequests,
                totalPrescriptions,
                totalConsultations
            };
        }));

        // Sort by closure rate descending
        const sortedMetrics = performanceMetrics.sort((a, b) => b.caseClosureRate - a.caseClosureRate);

        // Calculate system-wide averages
        const systemMetrics = {
            avgCaseClosureRate: sortedMetrics.length > 0 
                ? (sortedMetrics.reduce((acc, curr) => acc + curr.caseClosureRate, 0) / sortedMetrics.length).toFixed(2)
                : 0,
            avgResolutionHours: sortedMetrics.length > 0
                ? Math.round(sortedMetrics.reduce((acc, curr) => acc + curr.avgResolutionHours, 0) / sortedMetrics.length)
                : 0,
            avgResponseTime: sortedMetrics.length > 0
                ? Math.round(sortedMetrics.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / sortedMetrics.length)
                : 0,
            avgRating: sortedMetrics.length > 0
                ? (sortedMetrics.reduce((acc, curr) => acc + parseFloat(curr.avgRating || 0), 0) / sortedMetrics.length).toFixed(2)
                : 0
        };

        res.json({
            metrics: sortedMetrics,
            systemMetrics,
            topPerformers: sortedMetrics.slice(0, 5)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
