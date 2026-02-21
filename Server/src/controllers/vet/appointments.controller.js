import Consultation from "../../models/consultation.model.js";
import Case from "../../models/case.model.js";
import User from "../../models/user.model.js";
import { Vet } from "../../models/associations.js";

export const getAppointments = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const consultations = await Consultation.findAll({
      where: { vet_id: vet.id },
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
