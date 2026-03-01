import Animal from "../../models/animal.model.js";
import Case from "../../models/case.model.js";
import Consultation from "../../models/consultation.model.js";
import LabRequest from "../../models/labRequest.model.js";
import { Op, fn, col } from "sequelize";
import { success, error } from "../../utils/response.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Animals for this farmer
    const animalCount = await Animal.count({
      where: { farmer_id: userId },
      paranoid: false
    });

    // Active Cases (open)
    const activeCasesCount = await Case.count({
      where: { farmer_id: userId, status: 'open' },
      paranoid: false
    });

    // Get farmer's case IDs for nested queries
    const farmerCases = await Case.findAll({
      where: { farmer_id: userId },
      attributes: ['id'],
      paranoid: false
    });
    const caseIds = farmerCases.map(c => c.id);

    // Pending Consultations
    const pendingConsultationsCount = await Consultation.count({
      where: {
        case_id: { [Op.in]: caseIds }
      },
      paranoid: false
    });

    // Health Alerts (Lab requests with pending status)
    const alertsCount = await LabRequest.count({
      where: {
        status: 'pending',
        case_id: { [Op.in]: caseIds }
      },
      paranoid: false
    });

    // Case Status Distribution
    const statusDistribution = await Case.findAll({
      where: { farmer_id: userId },
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status'],
      paranoid: false
    });

    // Monthly activity (cases created per month)
    const monthlyActivity = await Case.findAll({
      where: { farmer_id: userId },
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
      limit: 6,
      paranoid: false
    });

    success(res, {
      totalAnimals: animalCount,
      activeCases: activeCasesCount,
      pendingConsultations: pendingConsultationsCount,
      healthAlerts: alertsCount,
      statusDistribution,
      monthlyActivity
    });
  } catch (err) {
    error(res, err.message);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch recent cases as activity
    const recentCases = await Case.findAll({
      where: { farmer_id: userId },
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { model: Animal, attributes: ['tag_number', 'species'] }
      ],
      paranoid: false
    });

    const activity = recentCases.map(c => ({
      message: `Case #${c.id} created for ${c.Animal?.species || 'Animal'} (${c.Animal?.tag_number || 'N/A'})`,
      date: c.created_at
    }));

    success(res, activity);
  } catch (err) {
    error(res, err.message);
  }
};
