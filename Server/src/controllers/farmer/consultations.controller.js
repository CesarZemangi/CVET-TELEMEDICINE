import Consultation from "../../models/consultation.model.js";
import Case from "../../models/case.model.js";

export const getConsultations = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const consultations = await Consultation.findAll({
      include: [
        {
          model: Case,
          where: { farmer_id: farmerId },
          attributes: ['id', 'title', 'description', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
