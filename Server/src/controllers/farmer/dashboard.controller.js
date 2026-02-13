import db from "../../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    // Total Animals for this farmer
    const [animalCount] = await db.query(
      "SELECT COUNT(*) as count FROM animals WHERE farmer_id = (SELECT id FROM farmers WHERE user_id = ?)",
      [req.user.id]
    );

    // Active Cases (open)
    const [activeCases] = await db.query(
      "SELECT COUNT(*) as count FROM cases WHERE farmer_id = (SELECT id FROM farmers WHERE user_id = ?) AND status = 'open'",
      [req.user.id]
    );

    // Pending Consultations
    const [pendingConsults] = await db.query(
      "SELECT COUNT(*) as count FROM consultations WHERE case_id IN (SELECT id FROM cases WHERE farmer_id = (SELECT id FROM farmers WHERE user_id = ?))",
      [req.user.id]
    );

    // Health Alerts (Lab requests with pending status)
    const [alerts] = await db.query(
      "SELECT COUNT(*) as count FROM lab_requests WHERE status = 'pending' AND case_id IN (SELECT id FROM cases WHERE farmer_id = (SELECT id FROM farmers WHERE user_id = ?))",
      [req.user.id]
    );

    res.json({
      totalAnimals: animalCount[0].count,
      activeCases: activeCases[0].count,
      pendingConsultations: pendingConsults[0].count,
      healthAlerts: alerts[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
