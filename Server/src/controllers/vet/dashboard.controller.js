import Case from "../../models/case.model.js";
import Consultation from "../../models/consultation.model.js";
import LabRequest from "../../models/labRequest.model.js";
import Animal from "../../models/animal.model.js";
import { Vet } from "../../models/associations.js";
import { Op, fn, col, literal } from "sequelize";

export const getDashboardData = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const vetId = vet.id;

    // Incoming / Active Cases assigned to this vet
    const incomingCasesCount = await Case.count({
      where: {
        vet_id: vetId,
        status: 'open'
      }
    });

    // Appointments (Consultations) for this vet
    const appointmentsCount = await Consultation.count({
      where: {
        vet_id: vetId
      }
    });

    // Lab Requests submitted by this vet
    const labRequestsCount = await LabRequest.count({
      where: {
        requested_by: vetId
      }
    });

    // Ongoing treatments (cases not closed)
    const ongoingTreatmentsCount = await Case.count({
      where: {
        vet_id: vetId,
        status: { [Op.ne]: 'closed' }
      }
    });

    // Total consultations ever handled by this vet
    const totalConsultations = await Consultation.count({
      where: { vet_id: vetId }
    });

    // Case Status Distribution for cases assigned to this vet
    const statusDistribution = await Case.findAll({
      where: { vet_id: vetId },
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status']
    });

    // Weekly activity (consultations per day for the last 7 days)
    const weeklyActivity = await Consultation.findAll({
      where: { 
        vet_id: vetId,
        created_at: { [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 7 DAY)') }
      },
      attributes: [
        [fn('DAYNAME', col('created_at')), 'day'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DAYNAME', col('created_at'))],
      order: [[col('created_at'), 'ASC']]
    });

    res.json({
      incomingCases: incomingCasesCount,
      appointmentsToday: appointmentsCount,
      ongoingTreatments: ongoingTreatmentsCount,
      reportsSubmitted: labRequestsCount,
      totalConsultations: totalConsultations,
      statusDistribution,
      weeklyActivity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }
    
    // Fetch recent consultations as activity
    const recentConsults = await Consultation.findAll({
      where: { vet_id: vet.id },
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { 
          model: Case, 
          attributes: ['title'],
          include: [{ model: Animal, attributes: ['tag_number'] }]
        }
      ]
    });

    const activity = recentConsults.map(c => ({
      message: `Consultation started for case: ${c.Case?.title || 'Unknown'} (${c.Case?.Animal?.tag_number || 'N/A'})`,
      date: c.created_at
    }));

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
