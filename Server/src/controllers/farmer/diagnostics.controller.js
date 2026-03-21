import { LabRequest, LabResult, Case, Animal } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";
import sequelize from "../../config/db.js";
import { syncLabResultToMedicationHistory } from "../../services/labResultHistory.service.js";

export const getLabRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await LabRequest.findAll({
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

export const createLabRequest = async (req, res) => {
  try {
    const { case_id, test_type, notes } = req.body;
    const userId = req.user.id;

    if (!case_id || !test_type) {
      return res.status(400).json({ error: "case_id and test_type are required" });
    }

    // Validate case belongs to farmer
    const singleCase = await Case.findOne({
      where: { id: case_id, farmer_id: userId }
    });

    if (!singleCase) {
      return res.status(403).json({ error: "Access denied or case not found" });
    }

    const labRequest = await LabRequest.create({
      case_id,
      vet_id: singleCase.vet_id, // Assigned vet from case
      test_type,
      notes,
      status: 'pending',
      created_by: userId,
      updated_by: userId
    });

    await logAction(userId, `Farmer requested lab test for case #${case_id}: ${test_type}`);

    res.status(201).json(labRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLabResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await LabResult.findAll({
      include: [
        { 
          model: LabRequest,
          include: [
            { 
              model: Case, 
              where: { farmer_id: userId },
              attributes: ['id', 'title', 'status', 'animal_id'],
              include: [{ model: Animal, attributes: ['id', 'tag_number', 'species'] }]
            }
          ]
        }
      ],
      order: [['uploaded_at', 'DESC']]
    });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const farmerUploadLabResult = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const body = (req && req.body && typeof req.body === "object") ? req.body : {};
    const lab_request_id = body.lab_request_id || body.id;
    const { result } = body;
    const uploadedFile =
      req.file ||
      (req.files?.file && req.files.file[0]) ||
      (req.files?.resultFile && req.files.resultFile[0]) ||
      (req.files?.lab_file && req.files.lab_file[0]);
    const fileUrl = uploadedFile ? `/uploads/lab-results/${uploadedFile.filename}` : null;
    const userId = req.user.id;

    if (!lab_request_id || (!result && !fileUrl)) {
      return res.status(400).json({
        error: "Validation Failed",
        detail: "lab_request_id and either result text or a PDF file are required"
      });
    }

    // Validate the lab request belongs to this farmer's case
    const labRequest = await LabRequest.findByPk(lab_request_id, {
      include: [{ model: Case, where: { farmer_id: userId }, attributes: ["id", "title", "animal_id"] }],
      transaction
    });

    if (!labRequest) {
      await transaction.rollback();
      return res.status(403).json({ error: "Access denied or lab request not found" });
    }

    const existingResult = await LabResult.findOne({
      where: { lab_request_id },
      transaction
    });

    let labResult = existingResult;
    if (existingResult) {
      await existingResult.update({
        result: result || existingResult.result,
        file_url: fileUrl || existingResult.file_url || null,
        uploaded_at: new Date(),
        updated_by: userId
      }, { transaction });
    } else {
      labResult = await LabResult.create({
        lab_request_id,
        result: result || "",
        file_url: fileUrl,
        uploaded_at: new Date(),
        created_by: userId,
        updated_by: userId
      }, { transaction });
    }

    await LabRequest.update(
      { status: 'completed', updated_by: userId },
      { where: { id: lab_request_id }, transaction }
    );

    await syncLabResultToMedicationHistory({
      labRequest,
      result: result || labResult?.result || "",
      file_url: fileUrl,
      actorUserId: userId,
      actorLabel: "Farmer",
      transaction
    });

    await logAction(userId, `Farmer uploaded lab result for request #${lab_request_id}`);
    await transaction.commit();

    res.status(existingResult ? 200 : 201).json({
      data: labResult,
      message: "Result uploaded successfully and recorded in medication history"
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const getVaccinations = async (req, res) => {
  try {
    // Return empty array for now since no table exists
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLabResult = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const labResult = await LabResult.findOne({
      where: { id },
      include: [{
        model: LabRequest,
        include: [{ model: Case, where: { farmer_id: userId }, attributes: ["id"] }]
      }]
    });

    if (!labResult) {
      return res.status(404).json({ error: "Lab result not found or access denied" });
    }

    await LabResult.destroy({ where: { id } });
    await logAction(userId, `Farmer deleted lab result #${id}`);
    res.json({ message: "Lab result deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getScreenings = async (req, res) => {
  try {
    // Return empty array for now since no table exists
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
