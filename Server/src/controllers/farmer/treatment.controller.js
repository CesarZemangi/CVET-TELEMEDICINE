import { Prescription, TreatmentPlan, Case, Animal, User, MedicationHistory, Vet } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";

export const getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Prescription.findAll({
      include: [
        { 
          model: Case, 
          where: { farmer_id: userId },
          attributes: ['id', 'title', 'status', 'animal_id', 'vet_id'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] },
            { 
              model: Vet, 
              as: 'vet',
              attributes: ['id', 'user_id'],
              include: [
                { model: User, attributes: ['id', 'name'] }
              ]
            }
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
          attributes: ['id', 'title', 'status', 'animal_id'],
          include: [{ model: Animal, attributes: ['id', 'tag_number', 'species'] }]
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
            {
              model: Vet,
              as: 'vet',
              attributes: ['id', 'user_id'],
              include: [
                { model: User, attributes: ['id', 'name'] }
              ]
            }
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
