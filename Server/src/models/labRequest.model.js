import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const LabRequest = sequelize.define('LabRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  vet_id: { type: DataTypes.INTEGER, allowNull: false },
  test_type: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'lab_requests', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default LabRequest;
