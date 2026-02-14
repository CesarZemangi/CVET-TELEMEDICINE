import { User, Case, Consultation, Message, VideoSession, PreventiveReminder, Notification, Farmer, Vet } from "../../models/associations.js";
import LabRequest from "../../models/labRequest.model.js";
import EmailLog from "../../models/emailLog.model.js";
import SMSLog from "../../models/smsLog.model.js";
import SystemLog from "../../models/systemLog.model.js";
import { fn, col, literal, Op } from "sequelize";

export const getOverview = async (req, res) => {
  try {
    const total_users = await User.count();
    const total_farmers = await User.count({ where: { role: 'farmer' } });
    const total_vets = await User.count({ where: { role: 'vet' } });
    const total_cases = await Case.count();
    const open_cases = await Case.count({ where: { status: 'open' } });
    const closed_cases = await Case.count({ where: { status: 'closed' } });
    const pending_lab_requests = await LabRequest.count({ where: { status: 'pending' } });
    const total_consultations = await Consultation.count();

    const total_messages = await Message.count();
    const unread_notifications = await Notification.count({ where: { is_read: false } });
    const active_video_sessions = await VideoSession.count({ where: { status: 'active' } });
    const completed_video_sessions = await VideoSession.count({ where: { status: 'ended' } });
    const total_emails_sent = await EmailLog.count({ where: { status: 'sent' } });
    const total_sms_sent = await SMSLog.count({ where: { status: 'sent' } });
    const pending_reminders = await PreventiveReminder.count({ where: { status: 'pending' } });
    const sent_reminders = await PreventiveReminder.count({ where: { status: 'sent' } });

    const recent_cases = await Case.findAll({
      attributes: ['id', 'description', 'created_at', 'status'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const recent_users = await User.findAll({
      attributes: ['id', 'name', 'role', 'created_at', 'profile_pic'],
      order: [['created_at', 'DESC']],
      limit: 8
    });

    res.json({
      total_users,
      total_farmers,
      total_vets,
      total_cases,
      open_cases,
      closed_cases,
      pending_lab_requests,
      total_consultations,
      total_messages,
      unread_notifications,
      active_video_sessions,
      completed_video_sessions,
      total_emails_sent,
      total_sms_sent,
      pending_reminders,
      sent_reminders,
      recent_cases,
      recent_users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'created_at']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ status });

    await SystemLog.create({
      user_id: req.user.id,
      action: `Admin ${req.user.name} changed status of user ${user.name} (ID: ${user.id}) to ${status}`
    });

    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'created_at']
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const caseCount = await Case.count({
      where: user.role === 'farmer' ? { farmer_id: user.id } : { vet_id: user.id }
    });

    const messageCount = await Message.count({
      where: { [Op.or]: [{ sender_id: user.id }, { receiver_id: user.id }] }
    });

    res.json({
      ...user.toJSON(),
      caseCount,
      messageCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarmerStats = async (req, res) => {
  try {
    const farmers = await User.findAll({
      where: { role: 'farmer' },
      attributes: ['id', 'name', 'email', 'status', 'phone', 'created_at'],
      include: [{
        model: Farmer,
        attributes: ['farm_name', 'location', 'livestock_count']
      }]
    });

    const farmerStats = await Promise.all(farmers.map(async (user) => {
      const totalCases = await Case.count({ where: { farmer_id: user.id } });
      const openCases = await Case.count({ where: { farmer_id: user.id, status: 'open' } });
      const closedCases = await Case.count({ where: { farmer_id: user.id, status: 'closed' } });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        phone: user.phone,
        created_at: user.created_at,
        farm_name: user.Farmer?.farm_name || 'N/A',
        location: user.Farmer?.location || 'N/A',
        livestock_count: user.Farmer?.livestock_count || 0,
        totalCases,
        openCases,
        closedCases
      };
    }));

    res.json(farmerStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVetStats = async (req, res) => {
  try {
    const vets = await User.findAll({
      where: { role: 'vet' },
      attributes: ['id', 'name', 'email', 'status', 'phone', 'created_at'],
      include: [{
        model: Vet,
        attributes: ['specialization', 'license_number', 'experience_years']
      }]
    });

    const vetStats = await Promise.all(vets.map(async (user) => {
      const assignedCases = await Case.count({ where: { vet_id: user.id } });
      const completedConsultations = await Consultation.count({ 
        where: { vet_id: user.id, status: 'completed' } 
      });
      const activeConsultations = await Consultation.count({ 
        where: { vet_id: user.id, status: 'active' } 
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        phone: user.phone,
        created_at: user.created_at,
        specialization: user.Vet?.specialization || 'N/A',
        license_number: user.Vet?.license_number || 'N/A',
        experience_years: user.Vet?.experience_years || 0,
        assignedCases,
        completedConsultations,
        activeConsultations
      };
    }));

    res.json(vetStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCases = async (req, res) => {
  try {
    const cases = await Case.findAll({
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { model: User, as: 'vet', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      include: [
        { model: User, as: 'vet', attributes: ['id', 'name'] },
        { model: Case, attributes: ['id', 'description'] }
      ],
      order: [['scheduled_at', 'DESC']]
    });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    await SystemLog.create({
      user_id: req.user.id,
      action: `Admin ${req.user.name} deleted user ${user.name} (ID: ${user.id})`
    });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at']
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
