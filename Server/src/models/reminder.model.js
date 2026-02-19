import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Reminder = sequelize.define('Reminder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  target_role: { type: DataTypes.ENUM('farmer', 'vet', 'all'), allowNull: false },
  schedule_date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('scheduled', 'sent'), defaultValue: 'scheduled' },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'reminders', timestamps: false });

export default Reminder;
