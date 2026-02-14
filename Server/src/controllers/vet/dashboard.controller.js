import Case from "../../models/case.model.js";
import Consultation from "../../models/consultation.model.js";
import LabRequest from "../../models/labRequest.model.js";
import { Op } from "sequelize";

export const getDashboardData = async (req, res) => {
  try {
    const vetUserId = req.user.id;

    // Incoming / Active Cases assigned to this vet
    const incomingCasesCount = await Case.count({
      where: {
        vet_id: vetUserId,
        status: 'open'
      }
    });

    // Appointments (Consultations) for this vet
    const appointmentsCount = await Consultation.count({
      where: {
        vet_id: vetUserId
      }
    });

    // Lab Requests submitted by this vet
    const labRequestsCount = await LabRequest.count({
      where: {
        requested_by: vetUserId
      }
    });

    // Ongoing treatments (cases not closed)
    const ongoingTreatmentsCount = await Case.count({
      where: {
        vet_id: vetUserId,
        status: { [Op.ne]: 'closed' }
      }
    });

    res.json({
      incomingCases: incomingCasesCount,
      appointmentsToday: appointmentsCount,
      ongoingTreatments: ongoingTreatmentsCount,
      reportsSubmitted: labRequestsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
