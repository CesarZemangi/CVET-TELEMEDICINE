import Case from "../../models/case.model.js";
import CaseMedia from "../../models/caseMedia.model.js";
import Animal from "../../models/animal.model.js";

export const getCases = async (req, res) => {
  try {
    const cases = await Case.findAll({
      where: { farmer_id: req.user.id }
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCase = async (req, res) => {
  try {
    const { animal_id, title, description } = req.body;

    if (!title || !description || !animal_id) {
      return res.status(400).json({ error: "Title, description and animal_id are required" });
    }

    // Validate animal belongs to farmer
    const animal = await Animal.findOne({
      where: { id: animal_id, farmer_id: req.user.id }
    });

    if (!animal) {
      return res.status(403).json({ error: "Animal not found or does not belong to you" });
    }

    const newCase = await Case.create({
      farmer_id: req.user.id,
      animal_id,
      title,
      description,
      status: 'open'
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findOne({
      where: { id: req.params.id, farmer_id: req.user.id }
    });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });
    res.json(singleCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify case belongs to farmer
    const singleCase = await Case.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!singleCase) {
      return res.status(403).json({ error: "Access denied or case not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const mediaEntries = await Promise.all(
      req.files.map(file => 
        CaseMedia.create({
          case_id: id,
          media_type: file.mimetype,
          file_path: file.path.replace(/\\/g, '/')
        })
      )
    );

    res.status(201).json({ message: "Media uploaded successfully", media: mediaEntries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
