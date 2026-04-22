import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true 
  },
  // Map 'password' in code to 'password_hash' in DB
  password: { 
    type: DataTypes.STRING,
    field: 'password_hash' 
  },
  role: { 
    type: DataTypes.ENUM('farmer', 'vet', 'admin') 
  },
  phone: { 
    type: DataTypes.STRING 
  },
  status: { 
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  sms_opt_in: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Legacy/alternate column name for profile image used by some clients
  profile_pic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, { 
  tableName: 'users', // Ensure this matches your phpMyAdmin table name
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at',
  indexes: [{ fields: ['role'] }]
});

export default User;
