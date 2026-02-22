import { Appointment, Case, User, Vet } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";

export const getVetAppointments = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const appointments = await Appointment.findAll({
      where: { vet_id: vet.id },
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ],
      order: [['appointment_date', 'DESC']]
    });

    res.json({
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    console.error("Error getting vet appointments:", error);
    res.status(500).json({ error: error.message });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });

    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const appointment = await Appointment.findOne({
      where: { id, vet_id: vet.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ 
        error: `Cannot approve appointment with status: ${appointment.status}` 
      });
    }

    await appointment.update({
      status: 'approved',
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet approved appointment #${id}`);

    res.json({
      message: "Appointment approved successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error approving appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });

    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const appointment = await Appointment.findOne({
      where: { id, vet_id: vet.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ 
        error: `Cannot reject appointment with status: ${appointment.status}` 
      });
    }

    await appointment.update({
      status: 'rejected',
      notes: reason || appointment.notes,
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet rejected appointment #${id}${reason ? `: ${reason}` : ''}`);

    res.json({
      message: "Appointment rejected successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });

    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const appointment = await Appointment.findOne({
      where: { id, vet_id: vet.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'approved') {
      return res.status(400).json({ 
        error: `Cannot complete appointment with status: ${appointment.status}. Only approved appointments can be marked complete.` 
      });
    }

    await appointment.update({
      status: 'completed',
      notes: summary || appointment.notes,
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet marked appointment #${id} as completed`);

    res.json({
      message: "Appointment marked as completed successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, reason } = req.body;
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });

    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    if (!appointment_date || !appointment_time) {
      return res.status(400).json({ 
        error: "appointment_date and appointment_time are required" 
      });
    }

    const appointment = await Appointment.findOne({
      where: { id, vet_id: vet.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'pending' && appointment.status !== 'approved') {
      return res.status(400).json({ 
        error: `Cannot reschedule appointment with status: ${appointment.status}` 
      });
    }

    // Verify new date is in future
    const newDateTime = new Date(`${appointment_date}T${appointment_time}`);
    if (newDateTime <= new Date()) {
      return res.status(400).json({ 
        error: "New appointment date and time must be in the future" 
      });
    }

    await appointment.update({
      appointment_date,
      appointment_time,
      notes: reason || appointment.notes,
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet rescheduled appointment #${id} to ${appointment_date} at ${appointment_time}${reason ? `: ${reason}` : ''}`);

    res.json({
      message: "Appointment rescheduled successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: error.message });
  }
};
