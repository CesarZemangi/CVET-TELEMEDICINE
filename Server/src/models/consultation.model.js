import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Consultation = sequelize.define('Consultation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  vet_id: { type: DataTypes.INTEGER },
  mode: { type: DataTypes.ENUM('chat', 'video') },
  notes: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'consultations', timestamps: false });

export default Consultation;
