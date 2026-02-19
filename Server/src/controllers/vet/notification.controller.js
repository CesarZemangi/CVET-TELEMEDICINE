import { Notification, Case, User } from '../../models/associations.js';
import { success, error } from '../../utils/response.js';

export const getVetNotifications = async (req, res) => {
  try {
    const vet_id = req.user.id;
    const notifications = await Notification.findAll({
      where: { user_id: vet_id },
      order: [['created_at', 'DESC']]
    });

    success(res, notifications, 'Vet notifications retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const markVetNotificationAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) return error(res, 'Notification not found', 404);

    notification.is_read = true;
    await notification.save();

    success(res, notification, 'Notification marked as read');
  } catch (err) {
    error(res, err.message);
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { case_id, title, message, type } = req.body;
    const sender_id = req.user.id;

    if (!case_id || !title || !message) {
      return res.status(400).json({ error: "case_id, title and message are required" });
    }

    const singleCase = await Case.findByPk(case_id);
    if (!singleCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const notification = await Notification.create({
      user_id: singleCase.farmer_id, // Receiver
      sender_id,
      case_id,
      title,
      message,
      type: type || 'update',
      is_read: false,
      created_by: sender_id,
      updated_by: sender_id
    });

    success(res, notification, 'Notification sent successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const getSentNotifications = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const notifications = await Notification.findAll({
      where: { sender_id },
      include: [
        { model: Case, attributes: ['title'] },
        { model: User, attributes: ['name'] } // Farmer
      ],
      order: [['created_at', 'DESC']]
    });

    success(res, notifications, 'Sent notifications retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};
