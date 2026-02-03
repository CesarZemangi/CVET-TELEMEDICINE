// 1. Convert requires to imports and add .js extensions
import Notification from '../../models/notification.model.js';
import { success, error } from '../../utils/response.js';

// 2. Change exports.method to export const method
// Get all notifications for logged-in vet
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

// Mark notification as seen (vet-specific)
export const markVetNotificationAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) return error(res, 'Notification not found', 404);

    notification.seen = true;
    await notification.save();

    success(res, notification, 'Notification marked as seen');
  } catch (err) {
    error(res, err.message);
  }
};