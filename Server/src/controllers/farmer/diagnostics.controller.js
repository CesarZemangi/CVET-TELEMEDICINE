import { LabRequest, LabResult, Case, Animal } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";

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
  try {
    const { lab_request_id, result } = req.body;
    const userId = req.user.id;

    if (!lab_request_id || !result) {
      return res.status(400).json({ error: "lab_request_id and result are required" });
    }

    // Validate the lab request belongs to this farmer's case
    const labRequest = await LabRequest.findByPk(lab_request_id, {
      include: [{ model: Case, where: { farmer_id: userId } }]
    });

    if (!labRequest) {
      return res.status(403).json({ error: "Access denied or lab request not found" });
    }

    const labResult = await LabResult.create({
      lab_request_id,
      result,
      created_by: userId,
      updated_by: userId
    });

    await LabRequest.update(
      { status: 'completed', updated_by: userId },
      { where: { id: lab_request_id } }
    );

    await logAction(userId, `Farmer uploaded lab result for request #${lab_request_id}`);

    res.status(201).json({ data: labResult, message: "Result uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
