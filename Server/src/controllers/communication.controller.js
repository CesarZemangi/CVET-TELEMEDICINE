import { Message, Case, Notification, User, Chatlog } from "../models/associations.js";
import { sendEmail } from "../services/email.service.js";
import { sendSMS } from "../services/sms.service.js";
import { Op } from "sequelize";

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

export const sendMessage = async (req, res) => {
  try {
    const { case_id, message } = req.body;
    const caseRecord = await Case.findByPk(case_id, {
      include: [
        { model: User, as: 'farmer' },
        { model: User, as: 'vet' }
      ]
    });

    if (!caseRecord) return res.status(404).json({ error: "Case not found" });

    // Validate ownership
    if (req.user.role === 'farmer' && caseRecord.farmer_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
    if (req.user.role === 'vet' && caseRecord.vet_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const receiver = req.user.role === 'farmer' ? caseRecord.vet : caseRecord.farmer;
    if (!receiver) return res.status(400).json({ error: "No receiver assigned to this case" });

    const newMessage = await Message.create({
      case_id,
      sender_id: req.user.id,
      receiver_id: receiver.id,
      message
    });

    // Also create Chatlog
    await Chatlog.create({
      case_id,
      sender_id: req.user.id,
      receiver_id: receiver.id,
      message
    });

    // Create Notification
    await Notification.create({
      user_id: receiver.id,
      title: "New Message",
      message: `You have a new message regarding case #${case_id}`,
      type: "message"
    });

    // Send Email
    try {
      await sendEmail({
        user_id: receiver.id,
        to: receiver.email,
        subject: `New message regarding case #${case_id}`,
        message: `You received a new message: "${message.substring(0, 50)}...". View it here: http://localhost:3000/${req.user.role === 'vet' ? 'farmer' : 'vet'}dashboard/cases`
      });
    } catch (emailErr) {
      console.error("Failed to send email alert:", emailErr);
    }

    // Send SMS alert (if opt-in)
    try {
      await sendSMS({
        user_id: receiver.id,
        message: `CVet: New message for Case #${case_id}. Check your portal.`
      });
    } catch (smsErr) {
      console.error("Failed to trigger SMS alert:", smsErr);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatlogs = async (req, res) => {
  try {
    const { case_id } = req.query;
    const where = {};
    if (case_id) where.case_id = case_id;

    // Filter by user involvement
    where[Op.or] = [
      { sender_id: req.user.id },
      { receiver_id: req.user.id }
    ];

    const logs = await Chatlog.findAll({
      where,
      include: [
        { model: User, as: 'sender', attributes: ['name', 'profile_pic'] },
        { model: User, as: 'receiver', attributes: ['name', 'profile_pic'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.update({ seen: true }, {
      where: { id: req.params.id, user_id: req.user.id }
    });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
