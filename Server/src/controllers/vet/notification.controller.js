import { Notification, Case, User } from '../../models/associations.js';
import { success, error } from '../../utils/response.js';

export const getVetNotifications = async (req, res) => {
  try {
    const vet_id = req.user.id;
    const notifications = await Notification.findAll({
      where: { receiver_id: vet_id },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'profile_pic'] }
      ],
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

export const sendNotification = async (req, res) => {
  try {
    const { case_id, receiver_id, type, title, message } = req.body;
    const sender_id = req.user.id;

    if (!case_id && !receiver_id) {
      return res.status(400).json({ error: "case_id or receiver_id is required" });
    }

    let finalReceiverId = receiver_id;
    let autoMessage = message;

    if (case_id) {
      const singleCase = await Case.findByPk(case_id);
      if (!singleCase) {
        return res.status(404).json({ error: "Case not found" });
      }
      finalReceiverId = singleCase.farmer_id;
      if (!autoMessage) {
        autoMessage = `Your veterinarian ${req.user.name} sent an update for case: ${singleCase.title}`;
      }
    }

    if (!finalReceiverId) {
      return res.status(400).json({ error: "Receiver could not be determined" });
    }

    const notification = await Notification.create({
      sender_id: sender_id,
      receiver_id: finalReceiverId,
      title: title || 'Case Update',
      message: autoMessage || `Your veterinarian ${req.user.name} sent you a notification`,
      type: type || 'update',
      reference_id: case_id || null, 
      is_read: false
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
      where: { sender_id: sender_id },
      include: [
        { model: User, as: 'receiver', attributes: ['id', 'name'] },
        { model: Case, as: 'Case', attributes: ['id', 'title'] }
      ],
      order: [['created_at', 'DESC']]
    });

    success(res, notifications, 'Sent notifications retrieved successfully');
  } catch (err) {
    error(res, err.message);
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Notification.destroy({
      where: { receiver_id: user_id }
    });
    success(res, null, 'All notifications cleared');
  } catch (err) {
    error(res, err.message);
  }
};
