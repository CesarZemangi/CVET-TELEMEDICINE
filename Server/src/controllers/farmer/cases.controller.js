import path from 'path';
import { Op } from "sequelize";
import { AiPredictionLog, Case, CaseMedia, Animal, User, Vet } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { logAction } from "../../utils/dbLogger.js";
import sequelize from "../../config/db.js";

export const getCases = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Case.findAndCountAll({
      where: { farmer_id: req.user.id },
      include: [
        { 
          model: Vet, 
          as: 'vet', 
          attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
      subQuery: false
    });

    const caseIds = data.rows.map((c) => c.id);
    let latestPredictionsByCaseId = new Map();
    if (caseIds.length > 0) {
      const predictionRows = await AiPredictionLog.findAll({
        attributes: ["case_id", "predicted_disease", "confidence", "vet_id", "created_at"],
        where: {
          case_id: { [Op.in]: caseIds },
          farmer_id: req.user.id
        },
        order: [["created_at", "DESC"]]
      });

      for (const row of predictionRows) {
        const key = Number(row.case_id);
        if (!latestPredictionsByCaseId.has(key)) {
          latestPredictionsByCaseId.set(key, row.toJSON());
        }
      }
    }

    // Flatten vet info for frontend and attach latest AI prediction
    const rows = data.rows.map(c => {
      const caseJson = c.toJSON();
      if (caseJson.vet) {
        caseJson.vet = {
          id: caseJson.vet.id,
          name: caseJson.vet.User?.name,
          user_id: caseJson.vet.User?.id
        };
      }
      caseJson.latest_prediction = latestPredictionsByCaseId.get(Number(caseJson.id)) || null;
      return caseJson;
    });

    const response = getPagingData({ count: data.count, rows }, page, limit);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { animal_id, vet_id, title, description, symptoms, priority } = req.body;

    // Validate animal belongs to farmer
    const animal = await Animal.findOne({
      where: { id: animal_id, farmer_id: req.user.id },
      transaction: t
    });

    if (!animal) {
      await t.rollback();
      return res.status(403).json({ error: "Animal not found or does not belong to you" });
    }

    // Validate vet exists
    const vet = await Vet.findOne({
      where: {
        [Op.or]: [
          { id: vet_id },
          { user_id: vet_id }
        ]
      },
      transaction: t
    });
    if (!vet) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid Vet selected" });
    }

    const newCase = await Case.create({
      farmer_id: req.user.id,
      vet_id: vet.id,
      animal_id,
      title,
      description,
      symptoms: symptoms || description,
      priority: priority || 'medium',
      status: 'open',
      created_by: req.user.id,
      updated_by: req.user.id
    }, { transaction: t });

    await logAction(req.user.id, `Farmer created case #${newCase.id}: ${title}`, {
      actionType: 'create',
      module: 'cases',
      entityId: newCase.id,
      ipAddress: req.ip
    });

    const createdCase = await Case.findByPk(newCase.id, {
      include: [
        { 
          model: Vet, 
          as: 'vet', 
          attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      transaction: t
    });

    await t.commit();

    const caseJson = createdCase.toJSON();
    if (caseJson.vet) {
      caseJson.vet = {
        id: caseJson.vet.id,
        name: caseJson.vet.User?.name,
        user_id: caseJson.vet.User?.id
      };
    }

    res.status(201).json(caseJson);
  } catch (err) {
    if (t) await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findOne({
      where: { id: req.params.id, farmer_id: req.user.id },
      include: [
        { 
          model: Vet, 
          as: 'vet', 
          attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Animal }
      ]
    });
    if (!singleCase) return res.status(404).json({ error: "Case not found" });

    const caseJson = singleCase.toJSON();
    if (caseJson.vet) {
      caseJson.vet = {
        id: caseJson.vet.id,
        name: caseJson.vet.User?.name,
        user_id: caseJson.vet.User?.id
      };
    }

    const latestPrediction = await AiPredictionLog.findOne({
      attributes: ["case_id", "predicted_disease", "confidence", "vet_id", "created_at"],
      where: {
        case_id: singleCase.id,
        farmer_id: req.user.id
      },
      order: [["created_at", "DESC"]]
    });
    caseJson.latest_prediction = latestPrediction ? latestPrediction.toJSON() : null;

    res.json(caseJson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadMedia = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const singleCase = await Case.findOne({
      where: { id, farmer_id: req.user.id },
      transaction: t
    });

    if (!singleCase) {
      await t.rollback();
      return res.status(403).json({ error: "Access denied or case not found" });
    }

    if (!req.files || req.files.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: "No files uploaded" });
    }

    const mediaEntries = await Promise.all(
      req.files.map(file => {
        const mediaData = {
          case_id: id,
          uploaded_by: req.user.id,
          updated_by: req.user.id,
          file_name: file.originalname,
          file_path: '/' + path.relative(process.cwd(), file.path).replace(/\\/g, '/'),
          file_type: file.mimetype,
          file_size: file.size
        };
        return CaseMedia.create(mediaData, { transaction: t });
      })
    );

    await logAction(req.user.id, `Farmer uploaded ${mediaEntries.length} media file(s) to case #${id}`, {
      actionType: 'upload',
      module: 'cases',
      entityId: id,
      ipAddress: req.ip
    });

    await t.commit();
    res.status(201).json({ message: "Media uploaded successfully", media: mediaEntries });
  } catch (err) {
    if (t) await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, symptoms, priority } = req.body;

    const singleCase = await Case.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!singleCase) {
      return res.status(404).json({ error: "Case not found or access denied" });
    }

    if (singleCase.status !== 'open') {
      return res.status(403).json({ error: "Cannot update a closed or processed case" });
    }

    await Case.update({
      title: title || singleCase.title,
      description: description || singleCase.description,
      symptoms: symptoms || singleCase.symptoms,
      priority: priority || singleCase.priority,
      updated_by: req.user.id
    }, {
      where: { id, farmer_id: req.user.id }
    });

    await logAction(req.user.id, `Farmer updated case #${id}`);

    res.json({ message: "Case updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCase = await Case.findOne({
      where: { id, farmer_id: req.user.id }
    });

    if (!singleCase) {
      return res.status(404).json({ error: "Case not found or access denied" });
    }

    if (singleCase.status !== 'open') {
      return res.status(403).json({ error: "Cannot delete a case that is already processed" });
    }

    await Case.destroy({
      where: { id, farmer_id: req.user.id }
    });

    await logAction(req.user.id, `Farmer deleted case #${id}`);

    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
