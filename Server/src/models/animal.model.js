import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Animal = sequelize.define('Animal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER, allowNull: false },
  tag_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  species: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING, allowNull: true },
  age: { type: DataTypes.INTEGER, allowNull: true },
  health_status: { type: DataTypes.STRING, defaultValue: 'healthy' },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'animals', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

export default Animal;
