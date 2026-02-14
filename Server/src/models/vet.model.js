import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vet = sequelize.define('Vet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'vets',
  timestamps: false
});

export default Vet;
