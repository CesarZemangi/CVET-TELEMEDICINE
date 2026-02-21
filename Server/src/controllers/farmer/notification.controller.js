import { Notification, Case, User } from '../../models/associations.js';
import Message from '../../models/message.model.js';
import { success, error } from '../../utils/response.js';

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { category } = req.query;
    
    const where = { receiver_id: user_id };
    if (category && category !== 'All') {
      where.type = category;
    }

    const notifications = await Notification.findAll({ 
      where, 
      include: [
        { model: Message, foreignKey: 'reference_id' }
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
      where: { id, receiver_id: req.user.id }
    });

    if (!notification) return error(res, 'Notification not found', 404);

    notification.is_read = true;
    await notification.save();

    success(res, notification, 'Notification marked as read');
  } catch (err) {
    error(res, err.message);
  }
};

export const createNotification = async (req, res) => {
  try {
    const { user_id, type, reference_id } = req.body;
    const sender_id = req.user.id;

    const notification = await Notification.create({
      sender_id: sender_id,
      receiver_id: user_id,
      type: type || 'system',
      reference_id,
      is_read: false
    });

    success(res, notification, 'Notification created successfully');
  } catch (err) {
    error(res, err.message);
  }
};
