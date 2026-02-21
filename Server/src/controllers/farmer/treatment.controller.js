import { Prescription, TreatmentPlan, Case, Animal, User, MedicationHistory } from "../../models/associations.js";

export const getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Prescription.findAll({
      include: [
        { 
          model: Case, 
          where: { farmer_id: userId },
          include: [
            { model: Animal, attributes: ['tag_number', 'species'] },
            { model: User, as: 'vet', attributes: ['name'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTreatmentPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await TreatmentPlan.findAll({
      include: [
        { 
          model: Case, 
          where: { farmer_id: userId },
          include: [{ model: Animal, attributes: ['tag_number', 'species'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedicationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animal_id } = req.query;

    const query = {
      include: [
        { model: Animal, attributes: ['id', 'tag_number', 'species'] },
        {
          model: Case,
          where: { farmer_id: userId },
          attributes: ['id', 'title'],
          include: [
            { model: User, as: 'vet', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    };

    if (animal_id) {
      query.where = { animal_id };
    }

    const data = await MedicationHistory.findAll(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
