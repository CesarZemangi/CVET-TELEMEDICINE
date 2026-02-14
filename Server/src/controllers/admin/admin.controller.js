import User from "../../models/user.model.js";
import Case from "../../models/case.model.js";
import LabRequest from "../../models/labRequest.model.js";
import Consultation from "../../models/consultation.model.js";
import Message from "../../models/message.model.js";
import VideoSession from "../../models/videoSession.model.js";
import EmailLog from "../../models/emailLog.model.js";
import SMSLog from "../../models/smsLog.model.js";
import PreventiveReminder from "../../models/preventiveReminder.model.js";
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
    const active_video_sessions = await VideoSession.count({ where: { status: 'active' } });
    const completed_video_sessions = await VideoSession.count({ where: { status: 'ended' } });
    const total_emails_sent = await EmailLog.count({ where: { status: 'sent' } });
    const total_sms_sent = await SMSLog.count({ where: { status: 'sent' } });
    const pending_reminders = await PreventiveReminder.count({ where: { status: 'pending' } });
    const sent_reminders = await PreventiveReminder.count({ where: { status: 'sent' } });

    const top_farmers = await Case.findAll({
      attributes: [
        'farmer_id',
        [fn('COUNT', col('Case.id')), 'case_count']
      ],
      include: [{ 
        model: User, 
        as: 'farmer', 
        attributes: ['name'],
        required: true 
      }],
      group: ['farmer_id', 'farmer.id'],
      order: [[literal('case_count'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    const top_vets = await Consultation.findAll({
      attributes: [
        'vet_id',
        [fn('COUNT', col('Consultation.id')), 'consult_count']
      ],
      include: [{ 
        model: User, 
        as: 'vet', 
        attributes: ['name'],
        required: true
      }],
      group: ['vet_id', 'vet.id'],
      order: [[literal('consult_count'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    const recent_cases = await Case.findAll({
      attributes: ['id', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const recent_users = await User.findAll({
      attributes: ['id', 'name', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
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
      active_video_sessions,
      completed_video_sessions,
      total_emails_sent,
      total_sms_sent,
      pending_reminders,
      sent_reminders,
      top_farmers,
      top_vets,
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
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await User.update({ status }, { where: { id: req.params.id } });
    res.json({ message: "User status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
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
