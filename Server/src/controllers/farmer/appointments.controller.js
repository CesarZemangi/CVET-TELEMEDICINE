import { Appointment, Case, User, Vet, Animal } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";
import { v4 as uuidv4 } from 'uuid';
import sequelize from "../../config/db.js";
import { Op } from "sequelize";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { getVetRatingsSummaryByVetIds } from "../../services/vetRating.service.js";
import { sendSMS } from "../../services/sms.service.js";

const APPOINTMENT_ATTRIBUTES = [
  'id',
  'case_id',
  'farmer_id',
  'vet_id',
  'appointment_date',
  'appointment_time',
  'status',
  'notes',
  'created_at',
  'updated_at'
];

export const createAppointmentRequest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { case_id, vet_id, appointment_date, appointment_time, notes } = req.body;
    const farmer_id = req.user.id;

    // Verify case exists and belongs to farmer
    const singleCase = await Case.findOne({
      where: { id: case_id, farmer_id },
      transaction: t
    });

    if (!singleCase) {
      await t.rollback();
      return res.status(403).json({ 
        error: "Case not found or does not belong to you" 
      });
    }

    // Verify vet exists
    const vetRecord = await Vet.findOne({
      where: {
        [Op.or]: [
          { id: vet_id },
          { user_id: vet_id }
        ]
      },
      transaction: t
    });
    if (!vetRecord) {
      await t.rollback();
      return res.status(400).json({ 
        error: "Vet not found" 
      });
    }

    // Verify appointment date is in future
    const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      await t.rollback();
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
    }, { transaction: t });

    await logAction(farmer_id, `Farmer created appointment request for case #${case_id} with vet #${vet_id} on ${appointment_date} at ${appointment_time}`, {
      actionType: 'create',
      module: 'appointments',
      entityId: appointment.id,
      ipAddress: req.ip
    });

    await t.commit();

    sendSMS({
      user_id: vetRecord.user_id,
      message: `CVET: New appointment request for case #${case_id} on ${appointment_date} ${appointment_time}.`
    }).catch((smsErr) => {
      console.error("Failed to send appointment request SMS:", smsErr?.message || smsErr);
    });

    res.status(201).json({
      message: "Appointment request created successfully",
      data: appointment
    });
  } catch (err) {
    if (t) await t.rollback();
    console.error('Create appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getFarmerAppointments = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const farmer_id = req.user.id;

    const data = await Appointment.findAndCountAll({
      attributes: APPOINTMENT_ATTRIBUTES,
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
      limit,
      offset,
      order: [['appointment_date', 'DESC']],
      raw: false,
      paranoid: false
    });

    const response = getPagingData(data, page, limit);
    res.json(response);
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
      where: { id, farmer_id },
      attributes: APPOINTMENT_ATTRIBUTES,
      paranoid: false
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

    const vetRecord = await Vet.findByPk(appointment.vet_id, {
      attributes: ["id", "user_id"]
    });
    if (vetRecord?.user_id) {
      sendSMS({
        user_id: vetRecord.user_id,
        message: `CVET: Appointment #${id} was cancelled by the farmer.`
      }).catch((smsErr) => {
        console.error("Failed to send appointment cancellation SMS:", smsErr?.message || smsErr);
      });
    }

    res.json({
      message: "Appointment cancelled successfully",
      data: appointment
    });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, notes } = req.body;
    const farmer_id = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, farmer_id },
      attributes: APPOINTMENT_ATTRIBUTES,
      paranoid: false
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ error: "Only pending appointments can be updated" });
    }

    // Verify appointment date is in future
    if (appointment_date && appointment_time) {
      const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
      if (appointmentDateTime <= new Date()) {
        return res.status(400).json({ error: "Appointment date and time must be in the future" });
      }
    }

    await appointment.update({
      appointment_date: appointment_date || appointment.appointment_date,
      appointment_time: appointment_time || appointment.appointment_time,
      notes: notes !== undefined ? notes : appointment.notes,
      updated_by: farmer_id
    });

    await logAction(farmer_id, `Farmer updated appointment #${id}`);

    res.json({ message: "Appointment updated successfully", data: appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, farmer_id },
      attributes: APPOINTMENT_ATTRIBUTES,
      paranoid: false
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== 'pending' && appointment.status !== 'cancelled') {
      return res.status(400).json({ error: "Only pending or cancelled appointments can be deleted" });
    }

    await appointment.destroy();

    await logAction(farmer_id, `Farmer deleted appointment #${id}`);

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinSession = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, farmer_id },
      attributes: APPOINTMENT_ATTRIBUTES,
      paranoid: false
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

    // Persist shared meeting id so farmer and vet join the same room.
    if (!appointment.meeting_id) {
      await appointment.update({ meeting_id: uuidv4() });
    }

    await logAction(req.user.id, `Farmer joined video session for appointment #${id}`);

    res.json({ 
      message: "Session joined", 
      meeting_id: appointment.meeting_id,
      appointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCasesForAppointments = async (req, res) => {
  try {
    const farmer_id = req.user.id;

    const cases = await Case.findAll({
      where: { farmer_id },
      attributes: ['id', 'title', 'description', 'status', 'priority', 'animal_id'],
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
        { model: User, where: { role: 'vet' }, attributes: ['id', 'name', 'phone', 'email', 'status'] }
      ],
      order: [[User, 'name', 'ASC']]
    });

    const vetIds = vets.map((vet) => vet.id);
    let ratingsByVetId = new Map();

    try {
      ratingsByVetId = await getVetRatingsSummaryByVetIds(vetIds);
    } catch (ratingsErr) {
      console.error("Failed to aggregate vet ratings:", ratingsErr.message);
    }

    const vetsWithRatings = vets.map((vet) => {
      const plainVet = vet.toJSON();
      const ratingSummary = ratingsByVetId.get(vet.id) || {
        average_rating: null,
        review_count: 0,
        comments: []
      };

      return {
        ...plainVet,
        average_rating: ratingSummary.average_rating,
        review_count: ratingSummary.review_count,
        comments: ratingSummary.comments
      };
    });

    res.json({
      data: vetsWithRatings,
      count: vetsWithRatings.length
    });
  } catch (error) {
    console.error("Error getting vets for appointments:", error);
    res.status(500).json({ error: error.message });
  }
};
