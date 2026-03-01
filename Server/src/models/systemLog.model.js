import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SystemLog = sequelize.define('SystemLog', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  module: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: { 
    type: DataTypes.TEXT,
    allowNull: false
  },
  old_value: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_value: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'system_logs', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SystemLog;
