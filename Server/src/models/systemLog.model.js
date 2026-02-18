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
  action: { 
    type: DataTypes.TEXT,
    allowNull: false
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
