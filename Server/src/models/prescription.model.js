import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config
const Prescription = sequelize.define('Prescription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  vet_id: { type: DataTypes.INTEGER, allowNull: false },
  medicine: { type: DataTypes.STRING, allowNull: false },
  dosage: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING, allowNull: false }
}, { 
  tableName: 'prescriptions', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

export default Prescription;
