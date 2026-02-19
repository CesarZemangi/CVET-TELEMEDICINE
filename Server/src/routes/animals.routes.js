import express from "express";
import auth from "../middleware/auth.middleware.js";
import { MedicationHistory, Case, User, Animal } from "../models/associations.js";

const router = express.Router();

// GET /api/animals/:id/medications
router.get("/:id/medications", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const history = await MedicationHistory.findAll({
      where: { animal_id: id },
      include: [
        { 
          model: Case, 
          attributes: ['title'],
          include: [{ model: User, as: 'vet', attributes: ['name'] }]
        },
        { model: Animal, attributes: ['tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;