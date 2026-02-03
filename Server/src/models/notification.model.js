import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  seen: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  tableName: 'notifications', 
  timestamps: false 
});

export default Notification;