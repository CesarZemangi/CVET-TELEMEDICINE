import { Notification, Case, User } from '../../models/associations.js';
import { success, error } from '../../utils/response.js';

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { category } = req.query;
    
    const where = { user_id };
    if (category && category !== 'All') {
      where.type = category;
    }

    const notifications = await Notification.findAll({ 
      where, 
      include: [
        { model: Case, attributes: ['title'] },
        { model: User, as: 'sender', attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']] 
    });

    success(res, notifications, 'Notifications retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!notification) return error(res, 'Notification not found', 404);

    notification.is_read = true;
    notification.updated_by = req.user.id;
    await notification.save();

    success(res, notification, 'Notification marked as read');
  } catch (err) {
    error(res, err.message);
  }
};

export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, case_id } = req.body;

    const notification = await Notification.create({
      user_id,
      sender_id: req.user.id,
      case_id,
      title,
      message,
      type: type || 'system',
      is_read: false,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    success(res, notification, 'Notification created successfully');
  } catch (err) {
    error(res, err.message);
  }
};
