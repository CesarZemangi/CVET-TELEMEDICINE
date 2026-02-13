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
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'users', // Ensure this matches your phpMyAdmin table name
  timestamps: false 
});

export default User;