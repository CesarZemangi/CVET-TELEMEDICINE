import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vet = sequelize.define('Vet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING, // e.g., Large Animals, Poultry, Surgery
    allowNull: false
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'vets',
  timestamps: true,
  underscored: true
});

export default Vet;