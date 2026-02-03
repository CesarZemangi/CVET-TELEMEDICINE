import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Farmer = sequelize.define('Farmer', {
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
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'farmers',
  timestamps: true, // Automatically handles createdAt and updatedAt
  underscored: true // Use snake_case for fields like created_at in the DB
});

export default Farmer;