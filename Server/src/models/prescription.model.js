import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config
const Prescription = sequelize.define('Prescription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  consultation_id: { type: DataTypes.INTEGER },
  medication_name: { type: DataTypes.STRING },
  dosage: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
  instructions: { type: DataTypes.TEXT }
}, { tableName: 'prescriptions', timestamps: false });

export default Prescription;
