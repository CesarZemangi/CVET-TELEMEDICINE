import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config
const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  sender_id: { type: DataTypes.INTEGER },
  receiver_id: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'messages', timestamps: false });

export default Message;
