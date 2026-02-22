import { Case, User, Animal, Vet } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { logAction } from "../../utils/dbLogger.js";

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

    await logAction(req.user.id, `Vet assigned case #${id} to themselves`);

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

    await singleCase.update({ 
      status: 'closed',
      closed_at: new Date()
    });

    await logAction(req.user.id, `Vet closed case #${id}`);

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

    await logAction(req.user.id, `Vet updated case #${id} priority to ${priority}`);

    res.json({ message: "Priority updated", priority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVetCasesForDropdown = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) return res.status(403).json({ error: "Vet profile not found" });

    const cases = await Case.findAll({
      where: { vet_id: vetRecord.id },
      attributes: ['id', 'title', 'status', 'priority'],
      order: [['created_at', 'DESC']],
      raw: true
    });

    res.json({ 
      data: cases,
      count: cases.length,
      empty: cases.length === 0,
      message: cases.length === 0 
        ? "No assigned cases available. You need to have assigned cases to create prescriptions, treatment plans, lab requests, or medical history records." 
        : `${cases.length} case(s) available for treatment, prescriptions, lab requests, and medical records`,
      note: "case_id is mandatory when creating prescriptions, treatment plans, medication history, lab requests, and consultations"
    });
  } catch (err) {
    console.error('Get cases for dropdown error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getVetCasesSummary = async (req, res) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vetRecord) return res.status(403).json({ error: "Vet profile not found" });

    const totalCases = await Case.count({ where: { vet_id: vetRecord.id } });
    const openCases = await Case.count({ where: { vet_id: vetRecord.id, status: 'open' } });
    const closedCases = await Case.count({ where: { vet_id: vetRecord.id, status: 'closed' } });

    res.json({
      assigned: {
        total: totalCases,
        open: openCases,
        closed: closedCases
      },
      assigned_any_cases: totalCases > 0,
      info: totalCases === 0 
        ? "No cases currently assigned. New cases will appear here when a farmer requests your assistance."
        : `${totalCases} case(s) assigned (${openCases} open, ${closedCases} closed)`
    });
  } catch (err) {
    console.error('Get cases summary error:', err);
    res.status(500).json({ error: err.message });
  }
};