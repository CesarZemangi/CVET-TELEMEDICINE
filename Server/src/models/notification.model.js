import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false }, // Receiver
  sender_id: { type: DataTypes.INTEGER, allowNull: true },
  case_id: { type: DataTypes.INTEGER, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: true },
  reference_id: { type: DataTypes.INTEGER, allowNull: true },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'notifications', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Notification;
