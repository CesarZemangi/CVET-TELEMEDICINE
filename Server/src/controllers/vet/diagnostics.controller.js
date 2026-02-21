import { LabRequest, LabResult, Case, Vet } from "../../models/associations.js";
import { success, error } from "../../utils/response.js";

export const getLabRequests = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const requests = await LabRequest.findAll({
      where: { vet_id: vet.id },
      include: [{ model: Case }]
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

    success(res, labRequest, "Lab request created successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const uploadLabResult = async (req, res) => {
  try {
    const { lab_request_id, result } = req.body;

    if (!lab_request_id || !result) {
      return res.status(400).json({ error: "lab_request_id and result are required" });
    }

    const labResult = await LabResult.create({
      lab_request_id,
      result,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    // Update lab request status
    await LabRequest.update(
      { status: 'completed', updated_by: req.user.id },
      { where: { id: lab_request_id } }
    );

    success(res, labResult, "Lab result uploaded successfully");
  } catch (err) {
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
        include: [{ model: Case }]
      }]
    });
    success(res, results, "Lab results fetched");
  } catch (err) {
    error(res, err.message);
  }
};
