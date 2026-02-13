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
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'system_logs', 
  timestamps: false 
});

export default SystemLog;
