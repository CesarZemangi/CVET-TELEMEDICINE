import { Case, Consultation, LabRequest, Animal, Vet } from "../../models/associations.js";
import { Op, fn, col, literal } from "sequelize";
import { success, error } from "../../utils/response.js";

export const getDashboardData = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    const vetIds = Array.from(new Set([vet?.id, Number(req.user.id)].filter(Boolean)));

    // Incoming / Active Cases assigned to this vet
    const incomingCasesCount = await Case.count({
      where: {
        vet_id: { [Op.in]: vetIds },
        status: 'open'
      },
      paranoid: false
    });

    // Appointments (Consultations) for this vet
    const appointmentsCount = await Consultation.count({
      where: {
        vet_id: { [Op.in]: vetIds }
      },
      paranoid: false
    });

    // Lab Requests submitted by this vet
    const labRequestsCount = await LabRequest.count({
      where: {
        vet_id: { [Op.in]: vetIds }
      },
      paranoid: false
    });

    // Ongoing treatments (cases not closed)
    const ongoingTreatmentsCount = await Case.count({
      where: {
        vet_id: { [Op.in]: vetIds },
        status: { [Op.ne]: 'closed' }
      },
      paranoid: false
    });

    // Total consultations ever handled by this vet
    const totalConsultations = await Consultation.count({
      where: { vet_id: { [Op.in]: vetIds } },
      paranoid: false
    });

    // Case Status Distribution for cases assigned to this vet
    const statusDistribution = await Case.findAll({
      where: { vet_id: { [Op.in]: vetIds } },
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status'],
      paranoid: false
    });

    // Weekly activity (consultations per day for the last 7 days)
    const weeklyActivity = await Consultation.findAll({
      where: { 
        vet_id: { [Op.in]: vetIds },
        created_at: { [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 7 DAY)') }
      },
      attributes: [
        [fn('DAYNAME', col('created_at')), 'day'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DAYNAME', col('created_at'))],
      order: [[col('created_at'), 'ASC']],
      paranoid: false
    });

    success(res, {
      incomingCases: incomingCasesCount,
      appointmentsToday: appointmentsCount,
      ongoingTreatments: ongoingTreatmentsCount,
      reportsSubmitted: labRequestsCount,
      totalConsultations: totalConsultations,
      statusDistribution,
      weeklyActivity
    });
  } catch (err) {
    error(res, err.message);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    const vetIds = Array.from(new Set([vet?.id, Number(req.user.id)].filter(Boolean)));
    
    // Fetch recent consultations as activity
    const recentConsults = await Consultation.findAll({
      where: { vet_id: { [Op.in]: vetIds } },
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { 
          model: Case, 
          attributes: ['title'],
          include: [{ model: Animal, attributes: ['tag_number'] }]
        }
      ],
      paranoid: false
    });

    const activity = recentConsults.map(c => ({
      message: `Consultation started for case: ${c.Case?.title || 'Unknown'} (${c.Case?.Animal?.tag_number || 'N/A'})`,
      date: c.created_at
    }));

    success(res, activity);
  } catch (err) {
    error(res, err.message);
  }
};
