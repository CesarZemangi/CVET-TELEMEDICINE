import { Message, Case, Notification, User } from "../models/associations.js";
import { Op } from "sequelize";
import { getIO } from "../services/socket.service.js";
import sequelize from "../config/db.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver_id, case_id, message } = req.body;
    const sender_id = req.user.id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (!receiver_id) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    // Access validation
    if (req.user.role === 'farmer') {
      const isAssigned = await Case.findOne({ where: { farmer_id: sender_id, vet_id: receiver_id } });
      if (!isAssigned) return res.status(403).json({ error: "You can only message assigned vets" });
    } else if (req.user.role === 'vet') {
      const isAssigned = await Case.findOne({ where: { vet_id: sender_id, farmer_id: receiver_id } });
      if (!isAssigned) return res.status(403).json({ error: "You can only message farmers assigned through cases" });
    }

    const newMessage = await Message.create({
      case_id: case_id || null,
      sender_id,
      receiver_id,
      message,
      is_read: false,
      created_by: sender_id,
      updated_by: sender_id
    });

    // Create notification
    const notification = await Notification.create({
      user_id: receiver_id,
      sender_id,
      case_id: case_id || null,
      title: "New Message",
      message: `You have a new message from ${req.user.name}`,
      type: "chat",
      reference_id: newMessage.id,
      is_read: false,
      created_by: sender_id,
      updated_by: sender_id
    });

    // Real-time updates
    const io = getIO();
    const sender = await User.findByPk(sender_id, { attributes: ['id', 'name', 'profile_pic'] });
    const msgData = { ...newMessage.toJSON(), sender };

    io.to(`user_${receiver_id}`).emit('receive_message', msgData);
    io.to(`user_${receiver_id}`).emit('receive_notification', notification);
    
    const unreadCount = await Message.count({ where: { receiver_id: receiver_id, is_read: false } });
    io.to(`user_${receiver_id}`).emit('update_unread_count', { count: unreadCount });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Subquery to find latest message per conversation
    const conversations = await sequelize.query(`
      SELECT m.*, 
             u.name as partner_name, 
             u.profile_pic as partner_pic,
             u.role as partner_role,
             (SELECT COUNT(*) FROM messages WHERE receiver_id = :userId AND sender_id = CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END AND is_read = 0) as unread_count
      FROM messages m
      JOIN (
        SELECT 
          CASE WHEN sender_id = :userId THEN receiver_id ELSE sender_id END as partner_id,
          MAX(created_at) as latest_date
        FROM messages
        WHERE sender_id = :userId OR receiver_id = :userId
        GROUP BY partner_id
      ) latest ON (CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END) = latest.partner_id 
                AND m.created_at = latest.latest_date
      JOIN users u ON u.id = latest.partner_id
      ORDER BY m.created_at DESC
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatlogs = async (req, res) => {
  try {
    const { partner_id } = req.query;
    const userId = req.user.id;

    if (!partner_id) return res.status(400).json({ error: "Partner ID required" });

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: partner_id },
          { sender_id: partner_id, receiver_id: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_pic'] }
      ],
      order: [['created_at', 'ASC']]
    });

    // Mark as read
    await Message.update({ is_read: true }, {
      where: { sender_id: partner_id, receiver_id: userId, is_read: false }
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    let users = [];
    if (req.user.role === 'farmer') {
      // Farmers can see Vets they have cases with
      const cases = await Case.findAll({ where: { farmer_id: req.user.id }, attributes: ['vet_id'] });
      const vetIds = [...new Set(cases.map(c => c.vet_id))];
      users = await User.findAll({
        where: { id: vetIds, role: 'vet' },
        attributes: ['id', 'name', 'profile_pic', 'role']
      });
    } else if (req.user.role === 'vet') {
      // Vets can see Farmers they have cases with
      const cases = await Case.findAll({ where: { vet_id: req.user.id }, attributes: ['farmer_id'] });
      const farmerIds = [...new Set(cases.map(c => c.farmer_id))];
      users = await User.findAll({
        where: { id: farmerIds, role: 'farmer' },
        attributes: ['id', 'name', 'profile_pic', 'role']
      });
    } else if (req.user.role === 'admin') {
      users = await User.findAll({
        attributes: ['id', 'name', 'profile_pic', 'role']
      });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { partner_id } = req.body;
    await Message.update({ is_read: true }, {
      where: { sender_id: partner_id, receiver_id: req.user.id, is_read: false }
    });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminBroadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const users = await User.findAll({ attributes: ['id'] });
    
    const notifications = users.map(u => ({
      user_id: u.id,
      title,
      message,
      type: type || 'broadcast',
      created_by: req.user.id,
      updated_by: req.user.id
    }));

    await Notification.bulkCreate(notifications);
    
    const io = getIO();
    io.emit('receive_notification', { title, message, type: type || 'broadcast' });
    
    res.json({ message: "Broadcast sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminDirectNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    const notification = await Notification.create({
      user_id,
      sender_id: req.user.id,
      title,
      message,
      type: type || 'direct',
      created_by: req.user.id,
      updated_by: req.user.id
    });

    const io = getIO();
    io.to(`user_${user_id}`).emit('receive_notification', notification);
    const unreadCount = await Notification.count({ where: { user_id, is_read: false } });
    io.to(`user_${user_id}`).emit('update_notification_count', { count: unreadCount });

    res.json({ message: "Direct notification sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminViewAllChatlogs = async (req, res) => {
  try {
    const logs = await Message.findAll({
      include: [
        { model: User, as: 'sender', attributes: ['name', 'role'] },
        { model: User, as: 'receiver', attributes: ['name', 'role'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessagesByCase = async (req, res) => {
  try {
    const { case_id } = req.params;
    const caseRecord = await Case.findByPk(case_id);
    if (!caseRecord) return res.status(404).json({ error: "Case not found" });

    if (req.user.role === 'farmer' && caseRecord.farmer_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    if (req.user.role === 'vet' && caseRecord.vet_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const messages = await Message.findAll({
      where: { case_id },
      include: [
        { model: User, as: 'sender', attributes: ['name', 'profile_pic'] }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id },
          { receiver_id: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['name', 'profile_pic'] },
        { model: User, as: 'receiver', attributes: ['name', 'profile_pic'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

