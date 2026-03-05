import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { sendNotificationEmail } from '../services/notificationEmail.service.js';

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  receiver_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_id: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: true },
  reference_id: { type: DataTypes.INTEGER, allowNull: true },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  tableName: 'notifications', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at'
});

Notification.addHook("afterCreate", async (notification) => {
  await sendNotificationEmail(notification);
});

export default Notification;
