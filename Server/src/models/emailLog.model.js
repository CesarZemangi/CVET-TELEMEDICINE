import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const EmailLog = sequelize.define('EmailLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  email: { type: DataTypes.STRING },
  subject: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING }, // 'sent', 'failed'
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  error_message: { type: DataTypes.TEXT }
}, { tableName: 'email_logs', timestamps: false });

export default EmailLog;