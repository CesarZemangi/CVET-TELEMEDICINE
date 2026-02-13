import db from "../../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    // Incoming / Active Cases assigned to this vet
    const [activeCases] = await db.query(
      "SELECT COUNT(*) as count FROM cases WHERE vet_id = (SELECT id FROM vets WHERE user_id = ?) AND status = 'open'",
      [req.user.id]
    );

    // Appointments (Consultations) for this vet
    const [appointments] = await db.query(
      "SELECT COUNT(*) as count FROM consultations WHERE vet_id = (SELECT id FROM vets WHERE user_id = ?)",
      [req.user.id]
    );

    // Lab Requests submitted by this vet
    const [labRequests] = await db.query(
      "SELECT COUNT(*) as count FROM lab_requests WHERE requested_by = (SELECT id FROM vets WHERE user_id = ?)",
      [req.user.id]
    );

    // Ongoing treatments (cases not closed)
    const [ongoing] = await db.query(
      "SELECT COUNT(*) as count FROM cases WHERE vet_id = (SELECT id FROM vets WHERE user_id = ?) AND status != 'closed'",
      [req.user.id]
    );

    res.json({
      incomingCases: activeCases[0].count,
      appointmentsToday: appointments[0].count,
      ongoingTreatments: ongoing[0].count,
      reportsSubmitted: labRequests[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
