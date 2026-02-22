import CaseMedia from '../../models/caseMedia.model.js';
import Case from '../../models/case.model.js';
import { Vet, Animal } from '../../models/associations.js';
import { success, error } from '../../utils/response.js';
import { getCasesByVet } from '../../services/case.service.js';

export const uploadMedia = async (req, res) => {
  try {
    const { case_id } = req.body;
    const file = req.file;

    if (!case_id || !file) {
      return error(res, "case_id and file are required", 400);
    }

    // Validate case_id is a number
    const caseId = parseInt(case_id, 10);
    if (isNaN(caseId)) {
      return error(res, "case_id must be a valid number", 400);
    }

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const singleCase = await Case.findOne({
      where: { id: caseId, vet_id: vet.id }
    });

    if (!singleCase) {
      return error(res, "Case not found or not assigned to you", 403);
    }

    const media = await CaseMedia.create({
      case_id: caseId,
      media_type: file.mimetype,
      file_path: `/uploads/${file.filename}`
    });

    success(res, media, "Media uploaded successfully", 201);
  } catch (err) {
    console.error('Media upload error:', err);
    error(res, err.message, 500);
  }
};

export const getMediaByCaseId = async (req, res) => {
  try {
    const { case_id } = req.params;

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const singleCase = await Case.findOne({
      where: { id: case_id, vet_id: vet.id }
    });

    if (!singleCase) {
      return error(res, "Case not found or not assigned to you", 403);
    }

    const media = await CaseMedia.findAll({
      where: { case_id },
      include: [{
        model: Case,
        attributes: ['id', 'title', 'animal_id'],
        include: [
          { model: Animal, attributes: ['id', 'tag_number', 'species'] }
        ]
      }]
    });

    success(res, media, "Media retrieved successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const getAllVetMedia = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const media = await CaseMedia.findAll({
      include: [{
        model: Case,
        where: { vet_id: vet.id },
        attributes: ['id', 'title', 'animal_id'],
        include: [
          { model: Animal, attributes: ['id', 'tag_number', 'species'] }
        ]
      }],
      order: [['uploaded_at', 'DESC']]
    });

    success(res, media, "All media retrieved successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await CaseMedia.findByPk(id);
    if (!media) {
      return error(res, "Media not found", 404);
    }

    const singleCase = await Case.findByPk(media.case_id);
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });

    if (singleCase.vet_id !== vet.id) {
      return error(res, "Not authorized to delete this media", 403);
    }

    await media.destroy();
    success(res, null, "Media deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};

export const getCasesForMedia = async (req, res) => {
  try {
    const cases = await getCasesByVet(req.user.id);
    success(res, cases, "Cases fetched for media");
  } catch (err) {
    error(res, err.message);
  }
};
