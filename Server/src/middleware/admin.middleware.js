import SystemLog from "../models/systemLog.model.js";

export const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  
  // Log admin action
  try {
    await SystemLog.create({
      user_id: req.user.id,
      action: `Admin ${req.user.name} accessed ${req.method} ${req.originalUrl}`
    });
  } catch (err) {
    console.error("Failed to log admin action:", err);
  }

  next();
};
