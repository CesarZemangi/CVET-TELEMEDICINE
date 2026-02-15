import Case from "../../models/case.model.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

// Change getVetCases to getCases
export const getCases = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Case.findAndCountAll({
      where: { vet_id: req.user.id },
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

export const assignCase = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCase = await Case.findByPk(id);
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ vet_id: req.user.id, status: 'assigned' });
    res.json({ message: "Case assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const closeCase = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCase = await Case.findByPk(id);
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
    const singleCase = await Case.findByPk(id);
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    await singleCase.update({ priority });
    res.json({ message: "Priority updated", priority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
