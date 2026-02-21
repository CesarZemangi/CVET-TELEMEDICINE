import { Prescription, TreatmentPlan, Case, MedicationHistory, Animal, User, Vet } from "../../models/associations.js";
import { success, error } from "../../utils/response.js";

export const getPrescriptions = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }
    
    const data = await Prescription.findAll({
      where: { vet_id: vet.id },
      include: [{ model: Case }]
    });
    success(res, data, "Prescriptions fetched");
  } catch (err) {
    error(res, err.message);
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { case_id, medicine, dosage, duration } = req.body;

    if (!case_id || !medicine || !dosage || !duration) {
      return res.status(400).json({ error: "case_id, medicine, dosage and duration are required" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const prescription = await Prescription.create({
      case_id,
      vet_id: vet.id,
      medicine,
      dosage,
      duration
    });

    success(res, prescription, "Prescription created successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const createTreatmentPlan = async (req, res) => {
  try {
    const { case_id, plan_details, start_date, end_date } = req.body;

    if (!case_id || !plan_details) {
      return res.status(400).json({ error: "case_id and plan_details are required" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const plan = await TreatmentPlan.create({
      case_id,
      vet_id: vet.id,
      plan_details,
      start_date,
      end_date
    });

    success(res, plan, "Treatment plan created successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const getTreatmentPlans = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }
    
    const data = await TreatmentPlan.findAll({
      where: { vet_id: vet.id },
      include: [{ model: Case }]
    });
    success(res, data, "Treatment plans fetched");
  } catch (err) {
    error(res, err.message);
  }
};

export const createMedicationHistory = async (req, res) => {
  try {
    const { animal_id, case_id, medication_name, dosage, start_date, end_date, notes } = req.body;

    if (!animal_id || !case_id || !medication_name || !dosage || !start_date) {
      return res.status(400).json({ error: "animal_id, case_id, medication_name, dosage and start_date are required" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const history = await MedicationHistory.create({
      animal_id,
      case_id,
      vet_id: vet.id,
      medication_name,
      dosage,
      start_date,
      end_date,
      notes,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedicationHistory = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }
    
    const history = await MedicationHistory.findAll({
      where: { vet_id: vet.id },
      include: [
        { model: Case, attributes: ['id', 'title'] },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnimalMedications = async (req, res) => {
  try {
    const { animal_id } = req.params;
    const history = await MedicationHistory.findAll({
      where: { animal_id },
      include: [
        { model: Case, attributes: ['title'] },
        { model: User, as: 'vet', attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};