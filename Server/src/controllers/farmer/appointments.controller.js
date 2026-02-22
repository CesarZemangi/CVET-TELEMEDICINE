import { Appointment, Case, User, Vet, Animal } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";

export const createAppointmentRequest = async (req, res) => {
  try {
    const { case_id, vet_id, appointment_date, appointment_time, notes } = req.body;
    const farmer_id = req.user.id;

    // Validation
    if (!case_id || !vet_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ 
        error: "case_id, vet_id, appointment_date, and appointment_time are required" 
      });
    }

    // Verify case exists and belongs to farmer
    const singleCase = await Case.findOne({
      where: { id: case_id, farmer_id }
    });

    if (!singleCase) {
      return res.status(403).json({ 
        error: "Case not found or does not belong to you" 
      });
    }

    // Verify vet exists
    const vetRecord = await Vet.findByPk(vet_id);
    if (!vetRecord) {
      return res.status(400).json({ 
        error: "Vet not found" 
      });
    }

    // Verify appointment date is in future
    const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ 
        error: "Appointment date and time must be in the future" 
      });
    }

    // Create appointment (defaults to pending status)
    const appointment = await Appointment.create({
      case_id,
      farmer_id,
      vet_id: vetRecord.id,
      appointment_date,
      appointment_time,
      notes: notes || null,
      created_by: farmer_id,
      updated_by: farmer_id,
      status: 'pending'
    });

    await logAction(farmer_id, `Farmer created appointment request for case #${case_id} with vet #${vet_id} on ${appointment_date} at ${appointment_time}`);

    res.status(201).json({
      message: "Appointment request created successfully",
      data: appointment
    });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getFarmerAppointments = async (req, res) => {
  try {
    const farmer_id = req.user.id;

    const appointments = await Appointment.findAll({
      where: { farmer_id },
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description', 'animal_id'],
          include: [
            { model: Animal, attributes: ['id', 'tag_number', 'species'] }
          ]
        },
        {
          model: Vet,
          as: 'vet',
          attributes: ['id', 'user_id'],
          include: [
            { model: User, attributes: ['id', 'name', 'phone'] }
          ]
        }
      ],
      order: [['appointment_date', 'DESC']],
      raw: false
    });

    res.json({
      data: appointments,
      count: appointments.length
    });
  } catch (err) {
    console.error('Get farmer appointments error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, farmer_id }
    });

    if (!appointment) {
      return res.status(404).json({ 
        error: "Appointment not found" 
      });
    }

    // Only allow cancellation if pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({ 
        error: `Cannot cancel appointment with status: ${appointment.status}` 
      });
    }

    await appointment.update({
      status: 'cancelled',
      updated_by: farmer_id
    });

    await logAction(farmer_id, `Farmer cancelled appointment #${id}`);

    res.json({
      message: "Appointment cancelled successfully",
      data: appointment
    });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getCasesForAppointments = async (req, res) => {
  try {
    const farmer_id = req.user.id;

    const cases = await Case.findAll({
      where: { farmer_id },
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

export const getVetsForAppointments = async (req, res) => {
  try {
    const vets = await Vet.findAll({
      attributes: ['id', 'user_id'],
      include: [
        { model: User, attributes: ['id', 'name', 'phone', 'email'] }
      ],
      order: [[User, 'name', 'ASC']]
    });

    res.json({
      data: vets,
      count: vets.length
    });
  } catch (error) {
    console.error("Error getting vets for appointments:", error);
    res.status(500).json({ error: error.message });
  }
};
