import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config
const TreatmentPlan = sequelize.define('TreatmentPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  vet_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_details: { type: DataTypes.TEXT, allowNull: false },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE }
}, { 
  tableName: 'treatment_plans', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});
export default   TreatmentPlan;
