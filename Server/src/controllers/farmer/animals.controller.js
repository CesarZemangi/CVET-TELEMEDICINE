import Animal from "../../models/animal.model.js"
import { success, error } from "../../utils/response.js"
import { logAction } from "../../utils/dbLogger.js"
import { Case, Prescription, TreatmentPlan, LabRequest, LabResult, Appointment, MedicationHistory, Vet, User } from "../../models/associations.js"
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

export const getAnimals = async (req, res) => {
  try {
    if (!req.user?.id) {
      return error(res, "Unauthorized: user context missing", 401);
    }

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Animal.findAndCountAll({
      where: { farmer_id: req.user.id },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    })

    const response = getPagingData(data, page, limit);
    success(res, response, "Animals fetched")
  } catch (err) {
    error(res, err.message)
  }
}

export const createAnimal = async (req, res) => {
  try {
    const { tag_number, species, breed, age, health_status } = req.body

    const animal = await Animal.create({
      farmer_id: req.user.id,
      tag_number,
      species,
      breed,
      age,
      health_status: health_status || 'healthy',
      created_by: req.user.id,
      updated_by: req.user.id
    })

    await logAction(req.user.id, `Farmer added animal: ${species} ${tag_number}`)

    success(res, animal, "Animal added")
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return error(res, "Animal already exists", 400)
    }
    error(res, err.message)
  }
}

export const updateAnimal = async (req, res) => {
  try {
    const { tag_number, species, breed, age, health_status } = req.body

    await Animal.update({
      tag_number,
      species,
      breed,
      age,
      health_status,
      updated_by: req.user.id
    }, {
      where: { id: req.params.id, farmer_id: req.user.id }
    })

    await logAction(req.user.id, `Farmer updated animal #${req.params.id}`)

    success(res, null, "Animal updated")
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return error(res, "Animal already exists", 400)
    }
    error(res, err.message)
  }
}

export const deleteAnimal = async (req, res) => {
  try {
    await Animal.destroy({
      where: { id: req.params.id, farmer_id: req.user.id }
    })

    await logAction(req.user.id, `Farmer deleted animal #${req.params.id}`)

    success(res, null, "Animal deleted")
  } catch (err) {
    error(res, err.message)
  }
}

export const getAnimalMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findOne({
      where: { id, farmer_id: req.user.id },
      include: [
        {
          model: Case,
          include: [
            { model: Prescription },
            { model: TreatmentPlan },
            { 
              model: LabRequest,
              include: [{ model: LabResult }]
            },
            { 
              model: Appointment,
              include: [{ model: Vet, as: 'vet', include: [{ model: User, attributes: ['name'] }] }]
            }
          ]
        },
        { 
          model: MedicationHistory,
          include: [{ model: Vet, as: 'vet', include: [{ model: User, attributes: ['name'] }] }]
        }
      ],
      order: [
        [Case, 'created_at', 'DESC'],
        [MedicationHistory, 'created_at', 'DESC']
      ]
    });

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    success(res, animal, "Medical history fetched");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
