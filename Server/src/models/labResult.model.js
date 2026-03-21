import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const LabResult = sequelize.define('LabResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  lab_request_id: { type: DataTypes.INTEGER, allowNull: false },
  result: { type: DataTypes.TEXT, allowNull: false },
  file_url: { type: DataTypes.STRING, allowNull: true },
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'lab_results', 
  timestamps: true,
  paranoid: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default LabResult;
