import { Appointment, Case, User, Vet, Animal } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";
import { v4 as uuidv4 } from 'uuid';
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { sendSMS } from "../../services/sms.service.js";

export const getVetAppointments = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const data = await Appointment.findAndCountAll({
      where: { vet_id: vet.id },
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description', 'animal_id'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] }
          ]
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ],
      limit,
      offset,
      order: [['appointment_date', 'DESC']]
    });

    const response = getPagingData(data, page, limit);
    res.json(response);
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
    sendSMS({
      user_id: appointment.farmer_id,
      message: `CVET: Your appointment #${id} has been approved by the vet.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment approved SMS:", smsErr?.message || smsErr);
    });

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
    sendSMS({
      user_id: appointment.farmer_id,
      message: `CVET: Your appointment #${id} was rejected${reason ? ` (${reason})` : ""}.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment rejected SMS:", smsErr?.message || smsErr);
    });

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
    sendSMS({
      user_id: appointment.farmer_id,
      message: `CVET: Your appointment #${id} has been marked completed.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment completed SMS:", smsErr?.message || smsErr);
    });

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
    sendSMS({
      user_id: appointment.farmer_id,
      message: `CVET: Appointment #${id} was rescheduled to ${appointment_date} ${appointment_time}.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment rescheduled SMS:", smsErr?.message || smsErr);
    });

    res.json({
      message: "Appointment rescheduled successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
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

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return res.status(400).json({ 
        error: `Cannot cancel appointment with status: ${appointment.status}` 
      });
    }

    await appointment.update({
      status: 'cancelled',
      notes: reason || appointment.notes,
      updated_by: req.user.id
    });

    await logAction(req.user.id, `Vet cancelled appointment #${id}${reason ? `: ${reason}` : ''}`);
    sendSMS({
      user_id: appointment.farmer_id,
      message: `CVET: Your appointment #${id} was cancelled${reason ? ` (${reason})` : ""}.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment cancelled SMS:", smsErr?.message || smsErr);
    });

    res.json({
      message: "Appointment cancelled successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const joinSession = async (req, res) => {
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

    if (appointment.status !== 'approved') {
      return res.status(400).json({ error: "Only approved appointments can be joined" });
    }

    // Restrict by date and time
    const now = new Date();
    const apptDate = new Date(appointment.appointment_date);
    const timeStr = appointment.appointment_time;
    const [hours, minutes] = timeStr.split(':');
    
    const apptStartTime = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate(), parseInt(hours), parseInt(minutes));
    
    // Allowed window: 15 minutes before to 2 hours after
    const windowStart = new Date(apptStartTime.getTime() - 15 * 60000);
    const windowEnd = new Date(apptStartTime.getTime() + 120 * 60000);

    if (now < windowStart) {
      return res.status(403).json({ error: "Session not available yet. Please wait until 15 minutes before the scheduled time." });
    }

    if (now > windowEnd) {
      return res.status(403).json({ error: "Session has expired." });
    }

    // Generate meeting ID if not exists
    if (!appointment.meeting_id) {
      await appointment.update({ meeting_id: uuidv4() });
    }

    await logAction(req.user.id, `Vet joined video session for appointment #${id}`);

    res.json({ 
      message: "Session joined", 
      meeting_id: appointment.meeting_id,
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCasesForAppointments = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return res.status(404).json({ error: "Vet record not found" });
    }

    const cases = await Case.findAll({
      where: { vet_id: vet.id },
      attributes: ['id', 'title', 'status', 'priority', 'animal_id'],
      include: [
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      data: cases,
      count: cases.length
    });
  } catch (error) {
    console.error("Error getting cases for appointments:", error);
    res.status(500).json({ error: error.message });
  }
};
