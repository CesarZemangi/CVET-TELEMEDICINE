import { User, Case, Consultation, Message, VideoSession, PreventiveReminder, Notification, Farmer, Vet, Reminder, Animal, CaseMedia } from "../../models/associations.js";
import LabRequest from "../../models/labRequest.model.js";
import EmailLog from "../../models/emailLog.model.js";
import SMSLog from "../../models/smsLog.model.js";
import SystemLog from "../../models/systemLog.model.js";
import { fn, col, literal, Op } from "sequelize";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";
import { getIO } from "../../services/socket.service.js";

export const getOverview = async (req, res) => {
  try {
    const total_users = await User.count();
    const total_farmers = await User.count({ where: { role: 'farmer' } });
    const total_vets = await Vet.count();
    const total_cases = await Case.count();
    const open_cases = await Case.count({ where: { status: 'open' } });
    const closed_cases = await Case.count({ where: { status: 'closed' } });
    const pending_lab_requests = await LabRequest.count({ where: { status: 'pending' } });
    const total_consultations = await Consultation.count();
    const scheduled_reminders = await Reminder.count({ where: { status: 'scheduled' } });

    const total_messages = await Message.count();
    const unread_notifications = await Notification.count({ where: { is_read: false } });
    const active_video_sessions = await VideoSession.count({ where: { status: 'active' } });
    const completed_video_sessions = await VideoSession.count({ where: { status: 'ended' } });
    const total_emails_sent = await EmailLog.count({ where: { status: 'sent' } });
    const total_sms_sent = await SMSLog.count({ where: { status: 'sent' } });
    const pending_reminders = await PreventiveReminder.count({ where: { status: 'pending' } });
    const sent_reminders = await PreventiveReminder.count({ where: { status: 'sent' } });
    const failed_emails = await EmailLog.count({ where: { status: 'failed' } });
    const failed_sms = await SMSLog.count({ where: { status: 'failed' } });
    const high_priority_cases = await Case.count({ where: { priority: 'high' } });
    const critical_priority_cases = await Case.count({ where: { priority: 'critical' } });

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

    const casesByStatus = await Case.findAll({
      attributes: ['status', [fn('count', col('id')), 'count']],
      group: ['status']
    });

    const casesByPriority = await Case.findAll({
      attributes: ['priority', [fn('count', col('id')), 'count']],
      group: ['priority']
    });

    const monthlyCases = await Case.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
        [fn('count', col('id')), 'count']
      ],
      group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
      limit: 12
    });

    res.json({
      server_status: 'online',
      total_users,
      total_farmers,
      total_vets,
      total_cases,
      open_cases,
      closed_cases,
      pending_lab_requests,
      total_consultations,
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

export const getUsers = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
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
      const totalConsultations = await Consultation.count({ 
        where: { vet_id: user.id } 
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
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { 
          model: Vet, 
          as: 'vet',
          attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    const formattedData = data.map(c => ({
      ...c.toJSON(),
      vet: c.vet ? { ...c.vet.toJSON(), name: c.vet.User?.name } : null
    }));
    
    res.json({ data: formattedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConsultations = async (req, res) => {
  try {
    const data = await Consultation.findAll({
      include: [
        { model: User, as: 'vet', attributes: ['id', 'name'] },
        { model: Case, attributes: ['id', 'description'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ data });
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
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_pic', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'profile_pic', 'role'] },
        { model: Case, attributes: ['id', 'title'] }
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
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_pic'] },
        { model: Case, attributes: ['id', 'title'] }
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
      include: [
        {
          model: Case,
          attributes: ['id', 'title', 'animal_id'],
          include: [
            {
              model: Vet,
              as: 'vet',
              attributes: ['id'],
              include: [
                {
                  model: User,
                  attributes: ['id', 'name']
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
