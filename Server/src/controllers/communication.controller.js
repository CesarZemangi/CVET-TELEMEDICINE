import { Message, Case, Notification, User, Vet } from "../models/associations.js";
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
      const isAssigned = await Case.findOne({ 
        include: [{
          model: Vet,
          as: 'vet',
          where: { user_id: receiver_id }
        }],
        where: { farmer_id: sender_id } 
      });
      if (!isAssigned) return res.status(403).json({ error: "You can only message assigned vets" });
    } else if (req.user.role === 'vet') {
      const isAssigned = await Case.findOne({ 
        include: [{
          model: Vet,
          as: 'vet',
          where: { user_id: sender_id }
        }],
        where: { farmer_id: receiver_id } 
      });
      if (!isAssigned) return res.status(403).json({ error: "You can only message farmers assigned through cases" });
    }

    const newMessage = await Message.create({
      case_id: case_id || null,
      sender_id,
      receiver_id,
      message,
      is_read: false
    });

    // Create notification
    const notification = await Notification.create({
      receiver_id,
      type: "chat",
      reference_id: newMessage.id,
      is_read: false
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
      SELECT 
        u.id as partner_id,
        u.name as partner_name, 
        u.profile_pic as partner_pic,
        u.role as partner_role,
        m.message as lastMessage,
        m.created_at as lastTime,
        m.case_id,
        (SELECT COUNT(*) FROM messages WHERE receiver_id = :userId AND sender_id = u.id AND is_read = 0) as unread_count
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

    const formattedConversations = conversations.map(c => ({
      partner: {
        id: c.partner_id,
        name: c.partner_name,
        profile_pic: c.partner_pic,
        role: c.partner_role
      },
      lastMessage: c.lastMessage,
      lastTime: c.lastTime,
      case_id: c.case_id,
      unread_count: parseInt(c.unread_count) || 0
    }));

    res.json({ data: formattedConversations });
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

    // Find unread messages from this partner
    const unreadMessages = await Message.findAll({
      where: { sender_id: partner_id, receiver_id: userId, is_read: false },
      attributes: ['id']
    });

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(m => m.id);
      
      // Mark as read
      await Message.update({ is_read: true }, {
        where: { id: messageIds }
      });

      // Mark associated notifications as read
      await Notification.update({ is_read: true }, {
        where: { 
          receiver_id: userId, 
          type: 'chat',
          reference_id: messageIds
        }
      });
    }

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
      const cases = await Case.findAll({ 
        where: { farmer_id: req.user.id }, 
        include: [{ model: Vet, as: 'vet', attributes: ['user_id'] }] 
      });
      const vetUserIds = [...new Set(cases.map(c => c.vet?.user_id).filter(Boolean))];
      users = await User.findAll({
        where: { id: vetUserIds, role: 'vet' },
        attributes: ['id', 'name', 'profile_pic', 'role']
      });
    } else if (req.user.role === 'vet') {
      // Vets can see Farmers they have cases with
      const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
      const cases = await Case.findAll({ where: { vet_id: vetRecord.id }, attributes: ['farmer_id'] });
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
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { partner_id } = req.body;
    const userId = req.user.id;

    // Find unread messages from this partner
    const unreadMessages = await Message.findAll({
      where: { sender_id: partner_id, receiver_id: userId, is_read: false },
      attributes: ['id']
    });

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(m => m.id);
      
      // Mark messages as read
      await Message.update({ is_read: true }, {
        where: { id: messageIds }
      });

      // Mark associated notifications as read
      await Notification.update({ is_read: true }, {
        where: { 
          receiver_id: userId, 
          type: 'chat',
          reference_id: messageIds
        }
      });
    }

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { receiver_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ data: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminBroadcastNotification = async (req, res) => {
  try {
    const { title, message, role } = req.body;
    
    if (!message || !title) {
      return res.status(400).json({ error: "Title and message are required" });
    }
    
    const where = {};
    if (role && role !== 'all') {
      where.role = role;
    }
    
    const users = await User.findAll({ where, attributes: ['id'] });
    
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found for this role" });
    }
    
    const notifications = users.map(u => ({
      receiver_id: u.id,
      sender_id: req.user.id,
      title,
      message,
      type: 'broadcast',
      is_read: false,
      created_by: req.user.id,
      updated_by: req.user.id
    }));

    const createdNotifications = await Notification.bulkCreate(notifications);
    
    const io = getIO();
    users.forEach(u => {
      io.to(`user_${u.id}`).emit('receive_notification', { title, message, type: 'broadcast' });
    });
    
    res.json({ message: `Broadcast sent to ${createdNotifications.length} users`, data: createdNotifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminDirectNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;
    
    if (!user_id || !message || !title) {
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
      is_read: false,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    const io = getIO();
    io.to(`user_${user_id}`).emit('receive_notification', notification);
    const unreadCount = await Notification.count({ where: { receiver_id: user_id, is_read: false } });
    io.to(`user_${user_id}`).emit('update_notification_count', { count: unreadCount });

    res.json({ message: "Direct notification sent", data: notification });
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
    const caseRecord = await Case.findByPk(case_id, {
      include: [{ model: Vet, as: 'vet', attributes: ['user_id'] }]
    });
    if (!caseRecord) return res.status(404).json({ error: "Case not found" });

    if (req.user.role === 'farmer' && caseRecord.farmer_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    if (req.user.role === 'vet' && caseRecord.vet?.user_id !== req.user.id) {
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

