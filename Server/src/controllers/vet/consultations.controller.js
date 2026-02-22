import Consultation from "../../models/consultation.model.js";
import Case from "../../models/case.model.js";
import { Vet } from "../../models/associations.js";
import { success, error } from "../../utils/response.js";
import { logAction } from "../../utils/dbLogger.js";

export const getVetConsultations = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const consultations = await Consultation.findAll({
      where: { vet_id: vet.id },
      include: [{ model: Case }]
    });
    success(res, consultations, "Consultations fetched successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const createConsultation = async (req, res) => {
  try {
    const { case_id, mode, notes } = req.body;

    if (!case_id || !mode) {
      return res.status(400).json({ error: "case_id and mode are required" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    // Verify case belongs to this vet
    const singleCase = await Case.findOne({
      where: { id: case_id, vet_id: vet.id }
    });

    if (!singleCase) {
      return res.status(403).json({ error: "You are not assigned to this case or case not found" });
    }

    const consultation = await Consultation.create({
      case_id,
      vet_id: vet.id,
      mode,
      notes: notes || ""
    });

    await logAction(req.user.id, `Vet created consultation for case #${case_id}: ${mode}`);

    success(res, consultation, "Consultation created successfully");
  } catch (err) {
    error(res, err.message);
  }
};
