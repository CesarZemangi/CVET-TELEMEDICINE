import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notification = sequelize.define('Notification', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  message: { 
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  seen: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'notifications', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Notification;
