import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Animal = sequelize.define('Animal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER, allowNull: false },
  tag_number: { type: DataTypes.STRING, unique: true },
  species: { type: DataTypes.STRING },
  breed: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  health_status: { type: DataTypes.STRING, defaultValue: 'healthy' }
}, { tableName: 'animals', timestamps: false });

export default Animal;
