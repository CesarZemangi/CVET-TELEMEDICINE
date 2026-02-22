import { Appointment, Case, User } from "../../models/associations.js";
import { logAction } from "../../utils/dbLogger.js";
import { fn, col } from "sequelize";

export const getAllAppointments = async (req, res) => {
  try {
    const { status, case_id, farmer_id, vet_id } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (case_id) where.case_id = parseInt(case_id);
    if (farmer_id) where.farmer_id = parseInt(farmer_id);
    if (vet_id) where.vet_id = parseInt(vet_id);

    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['appointment_date', 'DESC']]
    });

    res.json({
      data: appointments,
      count: appointments.length,
      filters: { status, case_id, farmer_id, vet_id }
    });
  } catch (error) {
    console.error("Error getting all appointments:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const stats = await Appointment.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const total = await Appointment.count();
    
    res.json({
      total,
      byStatus: stats
    });
  } catch (error) {
    console.error("Error getting appointment stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const adminOverrideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const admin_id = req.user.id;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const oldStatus = appointment.status;
    
    await appointment.update({
      status,
      notes: reason || appointment.notes,
      updated_by: admin_id
    });

    await logAction(admin_id, `Admin overrode appointment #${id} status from ${oldStatus} to ${status}${reason ? `: ${reason}` : ''}`);

    res.json({
      message: `Appointment status changed from ${oldStatus} to ${status}`,
      data: appointment
    });
  } catch (error) {
    console.error("Error overriding appointment status:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'description', 'status', 'priority']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ data: appointment });
  } catch (error) {
    console.error("Error getting appointment details:", error);
    res.status(500).json({ error: error.message });
  }
};
