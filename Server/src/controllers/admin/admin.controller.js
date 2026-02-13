import User from "../../models/user.model.js";
import Case from "../../models/case.model.js";
import LabRequest from "../../models/labRequest.model.js";
import Consultation from "../../models/consultation.model.js";

export const getOverview = async (req, res) => {
  try {
    const total_users = await User.count();
    const total_farmers = await User.count({ where: { role: 'farmer' } });
    const total_vets = await User.count({ where: { role: 'vet' } });
    const total_cases = await Case.count();
    const open_cases = await Case.count({ where: { status: 'open' } });
    const closed_cases = await Case.count({ where: { status: 'closed' } });
    const pending_lab_requests = await LabRequest.count({ where: { status: 'pending' } });
    const total_consultations = await Consultation.count();

    const recent_cases = await Case.findAll({
      attributes: ['id', 'title', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const recent_users = await User.findAll({
      attributes: ['id', 'name', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      total_users,
      total_farmers,
      total_vets,
      total_cases,
      open_cases,
      closed_cases,
      pending_lab_requests,
      total_consultations,
      recent_cases,
      recent_users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
