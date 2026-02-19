import { Case, User, Animal } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

export const getCases = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Case.findAndCountAll({
      where: { vet_id: req.user.id },
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
    const singleCase = await Case.findOne({
      where: { id: req.params.id, vet_id: req.user.id },
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

export const closeCase = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCase = await Case.findOne({ where: { id, vet_id: req.user.id } });
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
    const singleCase = await Case.findOne({ where: { id, vet_id: req.user.id } });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ priority });
    res.json({ message: "Priority updated", priority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}