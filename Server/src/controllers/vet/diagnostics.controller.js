import { LabRequest, LabResult, Case, Vet, Animal } from "../../models/associations.js";
import { success, error } from "../../utils/response.js";
import { logAction } from "../../utils/dbLogger.js";
import { getCasesByVet } from "../../services/case.service.js";
import sequelize from "../../config/db.js";
import { syncLabResultToMedicationHistory } from "../../services/labResultHistory.service.js";

export const getLabRequests = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const requests = await LabRequest.findAll({
      where: { vet_id: vet.id },
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'status', 'animal_id'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] }
          ]
        }
      ]
    });
    success(res, requests, "Lab requests fetched");
  } catch (err) {
    error(res, err.message);
  }
};

export const createLabRequest = async (req, res) => {
  try {
    const { case_id, test_type, notes } = req.body;

    if (!case_id || !test_type) {
      return res.status(400).json({ error: "case_id and test_type are required" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const labRequest = await LabRequest.create({
      case_id,
      vet_id: vet.id,
      test_type,
      notes,
      status: 'pending',
      created_by: req.user.id,
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet created lab request for case #${case_id}: ${test_type}`);

    success(res, labRequest, "Lab request created successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const uploadLabResult = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const body = (req && req.body && typeof req.body === "object") ? req.body : {};
    const lab_request_id = body.lab_request_id || body.id;
    const { result } = body;

    if (!lab_request_id || !result) {
      return res.status(400).json({ error: "lab_request_id (id) and result are required" });
    }

    const labRequest = await LabRequest.findByPk(lab_request_id, {
      include: [{
        model: Case,
        attributes: ["id", "title", "animal_id"]
      }],
      transaction
    });

    if (!labRequest) {
      await transaction.rollback();
      return res.status(404).json({ error: "Lab request not found" });
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id }, transaction });
    if (!vet || Number(labRequest.vet_id) !== Number(vet.id)) {
      await transaction.rollback();
      return res.status(403).json({ error: "Not authorized to update this lab request" });
    }

    const existingResult = await LabResult.findOne({
      where: { lab_request_id },
      transaction
    });

    let labResult = existingResult;
    if (existingResult) {
      await existingResult.update({
        result: result || existingResult.result,
        file_url: existingResult.file_url || null,
        uploaded_at: new Date(),
        updated_by: req.user.id
      }, { transaction });
    } else {
      labResult = await LabResult.create({
        lab_request_id,
        result: result || "",
        file_url: null,
        uploaded_at: new Date(),
        created_by: req.user.id,
        updated_by: req.user.id
      }, { transaction });
    }

    await LabRequest.update(
      { status: 'completed', updated_by: req.user.id },
      { where: { id: lab_request_id }, transaction }
    );

    await syncLabResultToMedicationHistory({
      labRequest,
      result,
      actorUserId: req.user.id,
      actorLabel: "Veterinarian",
      transaction
    });

    await logAction(req.user.id, `Vet uploaded lab result for request #${lab_request_id}`);
    await transaction.commit();

    success(res, labResult, "Lab result uploaded successfully and recorded in medication history");
  } catch (err) {
    if (transaction) await transaction.rollback();
    error(res, err.message);
  }
};

export const getLabResults = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const results = await LabResult.findAll({
      include: [{
        model: LabRequest,
        where: { vet_id: vet.id },
        include: [{
          model: Case,
          attributes: ['id', 'title', 'status', 'animal_id'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] }
          ]
        }]
      }]
    });
    success(res, results, "Lab results fetched");
  } catch (err) {
    error(res, err.message);
  }
};

export const getCasesForDiagnostics = async (req, res) => {
  try {
    const cases = await getCasesByVet(req.user.id);
    success(res, cases, "Cases fetched for diagnostics");
  } catch (err) {
    error(res, err.message);
  }
};
