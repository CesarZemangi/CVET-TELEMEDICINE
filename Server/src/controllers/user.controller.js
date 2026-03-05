import User from "../models/user.model.js"
import Vet from "../models/vet.model.js"
import { getVetRatingsSummaryByVetIds, getVetReviewsByVetId } from "../services/vetRating.service.js";
import { success, error } from "../utils/response.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'sms_opt_in', 'profile_image', 'created_at']
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateMe = async (req, res) => {
  try {
    const { name, email, phone, sms_opt_in } = req.body;
    let updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (sms_opt_in !== undefined) {
      updateData.sms_opt_in = sms_opt_in === true || sms_opt_in === "true" || sms_opt_in === 1 || sms_opt_in === "1";
    }

    if (req.file) {
      updateData.profile_image = `/uploads/${req.file.filename}`;
    }

    await User.update(updateData, { where: { id: req.user.id } });
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'sms_opt_in', 'profile_image']
    });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getVets = async (req, res) => {
  try {
    const vets = await Vet.findAll({
      include: [{
        model: User,
        where: { role: 'vet' },
        attributes: ['id', 'name', 'role', 'status']
      }],
      attributes: ['id', 'user_id']
    });
    
    if (!vets || vets.length === 0) {
      return success(res, [], "No vets found");
    }
    
    const vetIds = vets.map((v) => v.id);
    let ratingsByVetId = new Map();

    try {
      ratingsByVetId = await getVetRatingsSummaryByVetIds(vetIds);
    } catch (ratingsErr) {
      console.error("Failed to aggregate vet ratings:", ratingsErr.message);
    }

    const formatted = vets.map(v => ({
      id: v.id,
      user_id: v.user_id,
      name: v.User ? v.User.name : "Unknown Vet",
      status: v.User?.status || null,
      average_rating: ratingsByVetId.get(v.id)?.average_rating ?? null,
      review_count: ratingsByVetId.get(v.id)?.review_count ?? 0
    }));

    success(res, formatted, "Vets fetched successfully");
  } catch (err) {
    error(res, err.message);
  }
}

export const getVetReviews = async (req, res) => {
  try {
    const vetId = Number(req.params.id);
    if (!Number.isFinite(vetId)) {
      return error(res, "Invalid vet id", 400);
    }

    const vet = await Vet.findByPk(vetId, {
      attributes: ["id", "user_id"],
      include: [{
        model: User,
        where: { role: "vet" },
        attributes: ["id", "name", "status"]
      }]
    });

    if (!vet) {
      return error(res, "Vet not found", 404);
    }

    const reviews = await getVetReviewsByVetId(vetId);

    return success(res, {
      vet: {
        id: vet.id,
        user_id: vet.user_id,
        name: vet.User?.name || "Unknown Vet",
        status: vet.User?.status || null
      },
      reviews
    }, "Vet reviews fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
