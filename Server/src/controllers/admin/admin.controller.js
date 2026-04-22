import { User, Case, Consultation, Message, VideoSession, PreventiveReminder, Notification, Farmer, Vet, Reminder, Animal, CaseMedia, Appointment, FeedInventory } from "../../models/associations.js";
import LabRequest from "../../models/labRequest.model.js";
import EmailLog from "../../models/emailLog.model.js";
import SMSLog from "../../models/smsLog.model.js";
import SystemLog from "../../models/systemLog.model.js";
import { fn, col, literal, Op } from "sequelize";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { getIO } from "../../services/socket.service.js";
import { logAction } from "../../utils/dbLogger.js";
import Feedback from "../../models/feedback.model.js";

export const getOverview = async (req, res) => {
  try {
    const total_users = await User.count({ paranoid: false });
    const total_farmers = await User.count({ where: { role: 'farmer' }, paranoid: false });
    const total_vets = await User.count({ where: { role: 'vet' }, paranoid: false });
    const total_animals = await Animal.count({ paranoid: false });
    const total_cases = await Case.count({ paranoid: false });
    const open_cases = await Case.count({ where: { status: 'open' }, paranoid: false });
    const closed_cases = await Case.count({ where: { status: 'closed' }, paranoid: false });
    const active_cases = open_cases;
    const pending_lab_requests = await LabRequest.count({ where: { status: 'pending' }, paranoid: false });
    const total_consultations = await Consultation.count({ paranoid: false });
    const total_appointments = await Appointment.count({ paranoid: false });
    const pending_appointments = await Appointment.count({ where: { status: 'pending' }, paranoid: false });
    const approved_appointments = await Appointment.count({ where: { status: 'approved' }, paranoid: false });
    const completed_appointments = await Appointment.count({ where: { status: 'completed' }, paranoid: false });
    const rejected_appointments = await Appointment.count({ where: { status: 'rejected' }, paranoid: false });
    const cancelled_appointments = await Appointment.count({ where: { status: 'cancelled' }, paranoid: false });
    const scheduled_reminders = await Reminder.count({ where: { status: 'scheduled' }, paranoid: false });

    const total_messages = await Message.count({ paranoid: false });
    const unread_notifications = await Notification.count({ where: { is_read: false }, paranoid: false });
    const active_video_sessions = await VideoSession.count({ where: { status: 'active' }, paranoid: false });
    const completed_video_sessions = await VideoSession.count({ where: { status: 'ended' }, paranoid: false });
    const total_emails_sent = await EmailLog.count({ where: { status: 'sent' } });
    const total_sms_sent = await SMSLog.count({ where: { status: 'sent' } });
    const pending_reminders = await PreventiveReminder.count({ where: { status: 'pending' }, paranoid: false });
    const sent_reminders = await PreventiveReminder.count({ where: { status: 'sent' }, paranoid: false });
    const failed_emails = await EmailLog.count({ where: { status: 'failed' } });
    const failed_sms = await SMSLog.count({ where: { status: 'failed' } });
    const high_priority_cases = await Case.count({ where: { priority: 'high' }, paranoid: false });
    const critical_priority_cases = await Case.count({ where: { priority: 'critical' }, paranoid: false });
    const total_feed_items = await FeedInventory.count({ paranoid: false });
    let low_stock_items = 0;
    try {
      low_stock_items = await FeedInventory.count({
        where: {
          [Op.and]: [literal("quantity <= low_stock_threshold")]
        },
        paranoid: false
      });
    } catch {
      low_stock_items = 0;
    }

    const recent_cases = await Case.findAll({
      attributes: ['id', 'description', 'created_at', 'status'],
      order: [['created_at', 'DESC']],
      limit: 5,
      paranoid: false
    });

    const recent_users = await User.findAll({
      attributes: ['id', 'name', 'role', 'created_at', 'profile_image'],
      order: [['created_at', 'DESC']],
      limit: 8,
      paranoid: false
    });

    const casesByStatus = await Case.findAll({
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status'],
      paranoid: false
    });

    const casesByPriority = await Case.findAll({
      attributes: ['priority', [fn('count', col('id')), 'count']],
      group: ['priority'],
      paranoid: false
    });

    const monthlyCases = await Case.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
      limit: 12,
      paranoid: false
    });

    res.json({
      server_status: 'online',
      total_users,
      total_farmers,
      total_vets,
      total_animals,
      total_cases,
      open_cases,
      closed_cases,
      active_cases,
      pending_lab_requests,
      total_consultations,
      total_appointments,
      pending_appointments,
      approved_appointments,
      completed_appointments,
      rejected_appointments,
      cancelled_appointments,
      scheduled_reminders,
      total_messages,
      unread_notifications,
      active_video_sessions,
      completed_video_sessions,
      total_emails_sent,
      total_sms_sent,
      pending_reminders,
      sent_reminders,
      failed_emails,
      failed_sms,
      high_priority_cases,
      critical_priority_cases,
      total_feed_items,
      low_stock_items,
      recent_cases,
      recent_users,
      casesByStatus,
      casesByPriority,
      monthlyCases
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmailLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "50", 10);
    const logs = await EmailLog.findAll({
      order: [['created_at', 'DESC']],
      limit,
      attributes: [
        'id',
        ['email', 'to'],
        'subject',
        'message',
        'status',
        'error_message',
        'sent_at',
        'created_at'
      ]
    });
    const totals = {
      total_sent: await EmailLog.count({ where: { status: 'sent' } }),
      total_failed: await EmailLog.count({ where: { status: 'failed' } }),
      total: await EmailLog.count()
    };
    res.json({ data: logs, totals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmailLog = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ error: "to, subject, and message are required" });
    }
    const log = await EmailLog.create({
      email: to,
      subject,
      message,
      status: 'sent',
      created_at: new Date()
    });
    res.status(201).json({ message: "Email recorded", data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllFeedback = async (_req, res) => {
  try {
    const feedback = await Feedback.findAll({
      include: [
        { model: Case, attributes: ['id', 'title'], paranoid: false },
        { model: User, as: 'farmer', attributes: ['id', 'name', 'email'], paranoid: false },
        { model: Vet, as: 'vet', attributes: ['id'], include: [{ model: User, attributes: ['id', 'name', 'email'], paranoid: false }], paranoid: false }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ data: feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'created_at'],
      order: [['created_at', 'DESC']],
      paranoid: false
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'active' or 'inactive'" });
    }
    const user = await User.findByPk(req.params.id, { paranoid: false });
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ status });

    await SystemLog.create({
      user_id: req.user.id,
      action_type: "update",
      module: "users",
      entity_id: user.id,
      action: `Admin ${req.user.name} changed status of user ${user.name} (ID: ${user.id}) to ${status}`,
      old_value: null,
      new_value: { status },
      ip_address: req.ip,
      created_by: req.user.id,
      updated_by: req.user.id
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

    let caseCount = 0;
    if (user.role === "farmer") {
      caseCount = await Case.count({ where: { farmer_id: user.id } });
    } else if (user.role === "vet") {
      const vetProfile = await Vet.findOne({ where: { user_id: user.id } });
      caseCount = vetProfile ? await Case.count({ where: { vet_id: vetProfile.id } }) : 0;
    }

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

export const getOrCreateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "role", "status", "phone", "created_at", "profile_image"],
      paranoid: false
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = null;
    let profileCreated = false;

    if (user.role === "farmer") {
      const [farmerProfile, created] = await Farmer.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          user_id: user.id,
          farm_name: `${user.name || "Farmer"} Farm`,
          location: "",
          livestock_count: 0
        }
      });
      profile = farmerProfile;
      profileCreated = created;
    } else if (user.role === "vet") {
      const [vetProfile, created] = await Vet.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          user_id: user.id,
          specialization: "General Veterinary",
          license_number: null,
          experience_years: 0
        }
      });
      profile = vetProfile;
      profileCreated = created;
    }

    let caseCount = 0;
    if (user.role === "farmer") {
      caseCount = await Case.count({ where: { farmer_id: user.id } });
    } else if (user.role === "vet") {
      const vetProfile = profile || await Vet.findOne({ where: { user_id: user.id } });
      caseCount = vetProfile ? await Case.count({ where: { vet_id: vetProfile.id } }) : 0;
    }

    const messageCount = await Message.count({
      where: { [Op.or]: [{ sender_id: user.id }, { receiver_id: user.id }] }
    });

    res.json({
      user,
      profile,
      profile_created: profileCreated,
      stats: { caseCount, messageCount }
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
      paranoid: false,
      include: [{
        model: Farmer,
        attributes: ['farm_name', 'location', 'livestock_count'],
        required: false,
        paranoid: false
      }]
    });

    const farmerStats = await Promise.all(farmers.map(async (user) => {
      const totalCases = await Case.count({ where: { farmer_id: user.id }, paranoid: false });
      const openCases = await Case.count({ where: { farmer_id: user.id, status: 'open' }, paranoid: false });
      const closedCases = await Case.count({ where: { farmer_id: user.id, status: 'closed' }, paranoid: false });

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
      paranoid: false,
      include: [{
        model: Vet,
        attributes: ['id', 'specialization', 'license_number', 'experience_years'],
        required: false,
        paranoid: false
      }]
    });

    const vetStats = await Promise.all(vets.map(async (user) => {
      const vetId = user.Vet?.id;
      const assignedCases = vetId ? await Case.count({ where: { vet_id: vetId }, paranoid: false }) : 0;
      const totalConsultations = vetId ? await Consultation.count({ 
        where: { vet_id: vetId },
        paranoid: false
      }) : 0;

      return {
        id: user.id,
        vet_id: vetId,
        name: user.name,
        email: user.email,
        status: user.status,
        phone: user.phone,
        created_at: user.created_at,
        specialization: user.Vet?.specialization || 'N/A',
        license_number: user.Vet?.license_number || 'N/A',
        experience_years: user.Vet?.experience_years || 0,
        assignedCases,
        totalConsultations
      };
    }));

    res.json(vetStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCases = async (req, res) => {
  try {
    const data = await Case.findAll({
      paranoid: false,
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'], required: false, paranoid: false },
        { 
          model: Vet, 
          as: 'vet',
          attributes: ['id'],
          required: false,
          paranoid: false,
          include: [{ model: User, attributes: ['id', 'name'], required: false, paranoid: false }]
        },
        { model: Animal, attributes: ['id', 'tag_number', 'species'], required: false, paranoid: false }
      ],
      order: [['created_at', 'DESC']],
      raw: false,
      subQuery: false
    });
    
    const formattedData = data.map(c => {
      const caseJson = c.toJSON();
      return {
        ...caseJson,
        vet: caseJson.vet ? { ...caseJson.vet, name: caseJson.vet.User?.name } : null
      };
    });
    
    res.json({ 
      data: formattedData,
      count: data.length
    });
  } catch (err) {
    console.error('Get cases error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getConsultations = async (req, res) => {
  try {
    const data = await Consultation.findAll({
      paranoid: false,
      include: [
        {
          model: Vet,
          as: 'vet',
          attributes: ['id'],
          required: false,
          paranoid: false,
          include: [{ model: User, attributes: ['id', 'name'], required: false, paranoid: false }]
        },
        { 
          model: Case, 
          attributes: ['id', 'description'],
          required: false,
          paranoid: false,
          include: [{ model: Animal, attributes: ['id', 'tag_number', 'species'], required: false, paranoid: false }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedData = data.map(c => {
      const cJson = c.toJSON();
      return {
        ...cJson,
        vet: cJson.vet ? { ...cJson.vet, name: cJson.vet.User?.name } : null
      };
    });

    res.json(formattedData);
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
    const data = await SystemLog.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ data });
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

export const broadcastNotification = async (req, res) => {
  try {
    const { title, message, role } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }
    
    const where = {};
    if (role && role !== 'all') {
      where.role = role;
    }
    
    const users = await User.findAll({ where });
    
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found for this role" });
    }
    
    const notifications = await Promise.all(users.map(u => 
      Notification.create({
        receiver_id: u.id,
        sender_id: req.user.id,
        title,
        message,
        type: 'broadcast',
        is_read: false
      })
    ));

    await logAction(req.user.id, `Admin broadcast notification to ${notifications.length} ${role || 'all'} users: "${title}"`);
    
    try {
      const io = getIO();
      users.forEach(u => {
        io.to(`user_${u.id}`).emit('receive_notification', { title, message, type: 'broadcast' });
      });
    } catch (socketErr) {
      console.warn("Socket.io not initialized, notifications saved but not sent in real-time");
    }
    
    res.json({ message: `Broadcast sent to ${notifications.length} users`, data: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendDirectNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;
    
    if (!user_id || !title || !message) {
      return res.status(400).json({ error: "User ID, title, and message are required" });
    }
    
    const targetUser = await User.findByPk(user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const notification = await Notification.create({
      receiver_id: user_id,
      sender_id: req.user.id,
      title,
      message,
      type: 'direct',
      is_read: false
    });

    await logAction(req.user.id, `Admin sent direct notification to user #${user_id}: "${title}"`);
    
    try {
      const io = getIO();
      io.to(`user_${user_id}`).emit('receive_notification', { title, message, type: 'direct' });
    } catch (socketErr) {
      console.warn("Socket.io not initialized, notification saved but not sent in real-time");
    }
    
    res.json({ message: "Notification sent", data: notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChatLogs = async (req, res) => {
  try {
    const logs = await Message.findAll({
      paranoid: false,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_image', 'role'], required: false, paranoid: false },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'profile_image', 'role'], required: false, paranoid: false },
        { model: Case, attributes: ['id', 'title'], required: false, paranoid: false }
      ],
      order: [['created_at', 'DESC']]
    });
    
    const conversationMap = {};
    logs.forEach(msg => {
      const msgData = msg.toJSON();
      const key = [Math.min(msgData.sender_id, msgData.receiver_id), Math.max(msgData.sender_id, msgData.receiver_id)].join('_');
      if (!conversationMap[key]) {
        conversationMap[key] = {
          sender_id: msgData.sender_id,
          receiver_id: msgData.receiver_id,
          sender: msgData.sender,
          receiver: msgData.receiver,
          partner: msgData.sender,
          lastMessage: msgData.message,
          lastTime: msgData.created_at,
          case_id: msgData.case_id
        };
      }
    });
    
    const conversations = Object.values(conversationMap);
    res.json({ data: conversations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getThreadMessages = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.query;
    
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: "Sender ID and Receiver ID required" });
    }
    
    const messages = await Message.findAll({
      paranoid: false,
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_image'], required: false, paranoid: false },
        { model: Case, attributes: ['id', 'title'], required: false, paranoid: false }
      ],
      order: [['created_at', 'ASC']]
    });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const media = await CaseMedia.findAll({
      paranoid: false,
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'animal_id'],
          required: false,
          paranoid: false,
          include: [
            {
              model: Vet,
              as: 'vet',
              attributes: ['id'],
              required: false,
              paranoid: false,
              include: [
                {
                  model: User,
                  attributes: ['id', 'name'],
                  required: false,
                  paranoid: false
                }
              ]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({ data: media });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
