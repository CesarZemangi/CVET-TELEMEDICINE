import { User, Case, Message, PreventiveReminder, Vet, Consultation } from "../../models/associations.js";
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
            attributes: ['id'],
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });

        const performanceMetrics = await Promise.all(vets.map(async (vet) => {
            const totalAssigned = await Case.count({ where: { vet_id: vet.id } });
            const completedCases = await Case.count({ where: { vet_id: vet.id, status: 'closed' } });
            const activeCases = await Case.count({ where: { vet_id: vet.id, status: 'open' } });
            
            // Average response time
            // Logic: Measure difference between Case creation and first vet message
            const cases = await Case.findAll({ where: { vet_id: vet.id } });
            let totalResponseTime = 0;
            let casesWithResponse = 0;

            for (const c of cases) {
                const firstMessage = await Message.findOne({
                    where: { case_id: c.id, sender_id: vet.User.id },
                    order: [['created_at', 'ASC']]
                });

                if (firstMessage) {
                    const diff = new Date(firstMessage.created_at) - new Date(c.created_at);
                    totalResponseTime += diff;
                    casesWithResponse++;
                }
            }

            const avgResponseTime = casesWithResponse > 0 ? (totalResponseTime / casesWithResponse) / (1000 * 60) : 0; // in minutes

            const consultationCompletionRate = totalAssigned > 0 ? (completedCases / totalAssigned) * 100 : 0;
            
            const videoSessionCount = await Consultation.count({ 
                where: { vet_id: vet.id }
            });

            return {
                vet_id: vet.id,
                name: vet.User.name,
                specialization: vet.specialization,
                totalAssigned,
                completedCases,
                activeCases,
                avgResponseTime: Math.round(avgResponseTime),
                consultationCompletionRate: Math.round(consultationCompletionRate),
                videoSessionCount
            };
        }));

        // Sort by completion rate descending
        const sortedMetrics = performanceMetrics.sort((a, b) => b.consultationCompletionRate - a.consultationCompletionRate);

        res.json({
            metrics: sortedMetrics,
            systemAverageResponseTime: Math.round(sortedMetrics.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / (sortedMetrics.length || 1)),
            topPerformers: sortedMetrics.slice(0, 5)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
