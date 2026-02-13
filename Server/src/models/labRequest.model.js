import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const LabRequest = sequelize.define('LabRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  requested_by: { type: DataTypes.INTEGER }, // link to vets
  test_type: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' }
}, { tableName: 'lab_requests', timestamps: false });

export default LabRequest;
