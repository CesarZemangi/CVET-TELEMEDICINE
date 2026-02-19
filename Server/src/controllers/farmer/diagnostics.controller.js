import { LabRequest, LabResult, Case, Animal } from "../../models/associations.js";

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
