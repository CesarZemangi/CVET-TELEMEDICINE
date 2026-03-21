import User from "../models/user.model.js"
import Vet from "../models/vet.model.js"
import VetRating from "../models/vetRating.model.js";
import { getVetRatingsSummaryByVetIds, getVetReviewsByVetId, getSubmittedVetReviewsByActorId } from "../services/vetRating.service.js";
import { success, error } from "../utils/response.js";
import { logAction } from "../utils/dbLogger.js";

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
      updateData.profile_image = `/uploads/profile-images/${req.file.filename}`;
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
      specialization: v.specialization || null,
      experience_years: v.experience_years ?? 0,
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
    const summary = (await getVetRatingsSummaryByVetIds([vetId])).get(vetId) || {
      average_rating: null,
      review_count: 0,
      comments: []
    };

    return success(res, {
      vet: {
        id: vet.id,
        user_id: vet.user_id,
        name: vet.User?.name || "Unknown Vet",
        status: vet.User?.status || null
      },
      summary,
      reviews
    }, "Vet reviews fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const createVetReview = async (req, res) => {
  try {
    if (!["farmer", "admin"].includes(req.user?.role)) {
      return error(res, "Only farmers and admins can rate vets", 403);
    }

    const vetId = Number(req.params.id);
    const ratingValue = Number(req.body?.rating_value ?? req.body?.rating);
    const comment = String(req.body?.comment || "").trim();

    if (!Number.isFinite(vetId)) {
      return error(res, "Invalid vet id", 400);
    }

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return error(res, "rating_value must be an integer between 1 and 5", 400);
    }

    if (!comment) {
      return error(res, "comment is required", 400);
    }

    const vet = await Vet.findByPk(vetId, {
      attributes: ["id", "user_id"],
      include: [{
        model: User,
        where: { role: "vet" },
        attributes: ["id", "name"]
      }]
    });

    if (!vet) {
      return error(res, "Vet not found", 404);
    }

    const existingReview = await VetRating.findOne({
      where: {
        vet_id: vetId,
        farmer_id: req.user.id
      }
    });

    let review = existingReview;

    if (existingReview) {
      await existingReview.update({
        rating_value: ratingValue,
        comment,
        created_at: new Date()
      });
      await logAction(req.user.id, `${req.user.role} updated vet rating for vet #${vetId}`);
    } else {
      review = await VetRating.create({
        vet_id: vetId,
        farmer_id: req.user.id,
        rating_value: ratingValue,
        comment,
        created_at: new Date()
      });
      await logAction(req.user.id, `${req.user.role} created vet rating for vet #${vetId}`);
    }

    return success(res, {
      id: review.id,
      vet_id: review.vet_id,
      farmer_id: review.farmer_id,
      vet_name: vet.User?.name || "Unknown Vet",
      rating: review.rating_value,
      comment: review.comment,
      created_at: review.created_at
    }, existingReview ? "Vet rating updated successfully" : "Vet rating submitted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMySubmittedVetReviews = async (req, res) => {
  try {
    if (!["farmer", "admin"].includes(req.user?.role)) {
      return error(res, "Only farmers and admins can view submitted vet ratings", 403);
    }

    const reviews = await getSubmittedVetReviewsByActorId(req.user.id);
    return success(res, reviews, "Submitted vet ratings fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyVetReviews = async (req, res) => {
  try {
    if (req.user?.role !== "vet") {
      return error(res, "Only vets can view their received ratings", 403);
    }

    const vet = await Vet.findOne({
      where: { user_id: req.user.id },
      attributes: ["id", "user_id"],
      include: [{ model: User, attributes: ["id", "name"], required: false }]
    });

    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const reviews = await getVetReviewsByVetId(vet.id);
    const summary = (await getVetRatingsSummaryByVetIds([vet.id])).get(vet.id) || {
      average_rating: null,
      review_count: 0,
      comments: []
    };

    return success(res, {
      vet: {
        id: vet.id,
        user_id: vet.user_id,
        name: vet.User?.name || "Unknown Vet"
      },
      summary,
      reviews
    }, "Vet ratings fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
