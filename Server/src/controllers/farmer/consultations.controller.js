import Consultation from "../../models/consultation.model.js";
import Case from "../../models/case.model.js";
import Animal from "../../models/animal.model.js";
import Vet from "../../models/vet.model.js";
import User from "../../models/user.model.js";

export const getConsultations = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const consultations = await Consultation.findAll({
      include: [
        {
          model: Case,
          where: { farmer_id: farmerId },
          attributes: ['id', 'title', 'description', 'status'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] },
            {
              model: Vet,
              as: "vet",
              attributes: ["id", "user_id"],
              include: [{ model: User, attributes: ["id", "name"] }]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
