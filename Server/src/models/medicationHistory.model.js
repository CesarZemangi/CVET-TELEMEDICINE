import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MedicationHistory = sequelize.define('MedicationHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  animal_id: { type: DataTypes.INTEGER, allowNull: false },
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  vet_id: { type: DataTypes.INTEGER, allowNull: false },
  medication_name: { type: DataTypes.STRING, allowNull: false },
  dosage: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'medication_history', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default MedicationHistory;
