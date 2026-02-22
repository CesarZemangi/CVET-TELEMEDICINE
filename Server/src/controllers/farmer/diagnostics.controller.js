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
              include: [{ model: Animal, attributes: ['tag_number', 'species'] }]
            }
          ]
        }
      ],
      order: [['uploaded_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
