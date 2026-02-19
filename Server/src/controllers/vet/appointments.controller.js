import Consultation from "../../models/consultation.model.js";
import Case from "../../models/case.model.js";
import User from "../../models/user.model.js";

export const getAppointments = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: { vet_id: req.user.id },
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description'],
          include: [
            {
              model: User,
              as: 'farmer',
              attributes: ['name', 'phone']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(consultations);
  } catch (error) {
    console.error("Error in getAppointments:", error);
    res.status(500).json({ error: error.message });
  }
}
