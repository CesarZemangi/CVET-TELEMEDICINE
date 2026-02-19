import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  consultation_id: { type: DataTypes.INTEGER, allowNull: true }, // Can be null if linked directly to case
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  vet_id: { type: DataTypes.INTEGER, allowNull: false },
  farmer_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comments: { type: DataTypes.TEXT, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'feedback', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Feedback;
