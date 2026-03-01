import User from "../models/user.model.js"
import Vet from "../models/vet.model.js"
import { success, error } from "../utils/response.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'profile_image', 'created_at']
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateMe = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    let updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    if (req.file) {
      updateData.profile_image = `/uploads/${req.file.filename}`;
    }

    await User.update(updateData, { where: { id: req.user.id } });
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'profile_image']
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
    
    const formatted = vets.map(v => ({
      id: v.id,
      user_id: v.user_id,
      name: v.User ? v.User.name : "Unknown Vet",
      status: v.User?.status || null
    }));

    success(res, formatted, "Vets fetched successfully");
  } catch (err) {
    error(res, err.message);
  }
}
