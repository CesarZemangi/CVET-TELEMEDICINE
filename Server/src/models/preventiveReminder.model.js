import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PreventiveReminder = sequelize.define('PreventiveReminder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER },
  animal_id: { type: DataTypes.INTEGER },
  reminder_type: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  reminder_date: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('pending', 'sent', 'cancelled'), defaultValue: 'pending' },
  sent_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'preventive_reminders', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ fields: ['reminder_date'] }]
});

export default PreventiveReminder;