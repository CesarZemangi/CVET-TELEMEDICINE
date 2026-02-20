import User from "../models/user.model.js"
import Vet from "../models/vet.model.js"

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at']
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body
    await User.update({ name, email }, { where: { id: req.user.id } });
    res.json({ message: "Profile updated" })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getVets = async (req, res) => {
  try {
    const vets = await Vet.findAll({
      include: [{
        model: User,
        where: { status: 'active' },
        attributes: ['name']
      }],
      attributes: ['id', 'user_id']
    });
    
    // Flatten for frontend
    const formatted = vets.map(v => ({
      id: v.id, // This is Vet.id
      user_id: v.user_id,
      name: v.User?.name
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}