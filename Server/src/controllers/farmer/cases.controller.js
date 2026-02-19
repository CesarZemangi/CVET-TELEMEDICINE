import { Case, CaseMedia, Animal, User } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

export const getCases = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Case.findAndCountAll({
      where: { farmer_id: req.user.id },
      include: [
        { model: User, as: 'vet', attributes: ['id', 'name'] },
        { model: Animal, attributes: ['id', 'tag_number'] }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const response = getPagingData(data, page, limit);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCase = async (req, res) => {
  try {
    const { animal_id, vet_id, title, description, symptoms, priority } = req.body;

    if (!title || !description || !animal_id || !vet_id) {
      return res.status(400).json({ error: "Title, description, animal_id and vet_id are required" });
    }

    // Validate animal belongs to farmer
    const animal = await Animal.findOne({
      where: { id: animal_id, farmer_id: req.user.id }
    });

    if (!animal) {
      return res.status(403).json({ error: "Animal not found or does not belong to you" });
    }

    // Validate vet exists
    const vet = await User.findOne({ where: { id: vet_id, role: 'vet' } });
    if (!vet) {
      return res.status(400).json({ error: "Invalid Vet selected" });
    }

    const newCase = await Case.create({
      farmer_id: req.user.id,
      vet_id,
      animal_id,
      title,
      description,
      symptoms: symptoms || description,
      priority: priority || 'medium',
      status: 'open',
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findOne({
      where: { id: req.params.id, farmer_id: req.user.id },
      include: [
        { model: User, as: 'vet', attributes: ['id', 'name'] },
        { model: Animal }
      ]
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