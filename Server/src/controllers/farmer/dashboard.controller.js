import Animal from "../../models/animal.model.js";
import Case from "../../models/case.model.js";
import Consultation from "../../models/consultation.model.js";
import LabRequest from "../../models/labRequest.model.js";
import { Op } from "sequelize";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Animals for this farmer
    const animalCount = await Animal.count({
      where: { farmer_id: userId }
    });

    // Active Cases (open)
    const activeCasesCount = await Case.count({
      where: { farmer_id: userId, status: 'open' }
    });

    // Get farmer's case IDs for nested queries
    const farmerCases = await Case.findAll({
      where: { farmer_id: userId },
      attributes: ['id']
    });
    const caseIds = farmerCases.map(c => c.id);

    // Pending Consultations
    const pendingConsultationsCount = await Consultation.count({
      where: {
        case_id: { [Op.in]: caseIds }
      }
    });

    // Health Alerts (Lab requests with pending status)
    const alertsCount = await LabRequest.count({
      where: {
        status: 'pending',
        case_id: { [Op.in]: caseIds }
      }
    });

    res.json({
      totalAnimals: animalCount,
      activeCases: activeCasesCount,
      pendingConsultations: pendingConsultationsCount,
      healthAlerts: alertsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
