import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config
const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  sender_id: { type: DataTypes.INTEGER },
  receiver_id: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'messages', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ fields: ['case_id'] }]
});

export default Message;
