const Notification = require('../models/notification.model');
const { success, error } = require('../utils/response');

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.findAll({ where: { user_id }, order: [['created_at', 'DESC']] });

    success(res, notifications, 'Notifications retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

// Mark notification as seen
exports.markAsSeen = async (req, res) => {
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

// Create notification (system or admin trigger)
exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;

    const notification = await Notification.create({
      user_id,
      title,
      message,
      seen: false,
      created_at: new Date()
    });

    success(res, notification, 'Notification created successfully');
  } catch (err) {
    error(res, err.message);
  }
};
