import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Case = sequelize.define('Case', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER },
  vet_id: { type: DataTypes.INTEGER },
  animal_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  symptoms: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('open', 'closed'), defaultValue: 'open' },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  tableName: 'cases', 
  timestamps: false,
  indexes: [
    { fields: ['status'] },
    { fields: ['priority'] }
  ]
});

export default Case;
