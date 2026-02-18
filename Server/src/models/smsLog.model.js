import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SMSLog = sequelize.define('SMSLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  phone: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING }, // 'sent', 'failed'
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  error_message: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'sms_logs', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SMSLog;