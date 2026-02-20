import { Case, User, Animal, Vet } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

export const getCases = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) return res.status(403).json({ error: "Vet profile not found" });

    const data = await Case.findAndCountAll({
      where: { vet_id: vetRecord.id },
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
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

export const getCaseById = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) return res.status(403).json({ error: "Vet profile not found" });

    const singleCase = await Case.findOne({
      where: { id: req.params.id, vet_id: vetRecord.id },
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { model: Animal }
      ]
    });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });
    res.json(singleCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUnassignedCases = async (req, res) => {
  try {
    const data = await Case.findAll({
      where: { vet_id: 1 }, // Default unassigned vet id
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignCase = async (req, res) => {
  try {
    const { id } = req.params;
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) return res.status(403).json({ error: "Vet profile not found" });

    const singleCase = await Case.findByPk(id);
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ vet_id: vetRecord.id });
    res.json({ message: "Case assigned successfully", vet_id: vetRecord.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const closeCase = async (req, res) => {
  try {
    const { id } = req.params;
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    const singleCase = await Case.findOne({ where: { id, vet_id: vetRecord.id } });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ status: 'closed' });
    res.json({ message: "Case closed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    const singleCase = await Case.findOne({ where: { id, vet_id: vetRecord.id } });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ priority });
    res.json({ message: "Priority updated", priority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}