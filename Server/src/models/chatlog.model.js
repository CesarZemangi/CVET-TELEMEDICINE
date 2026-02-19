import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Chatlog = sequelize.define('Chatlog', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  case_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sender_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: { 
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
  updated_by: { type: DataTypes.INTEGER, allowNull: true }
}, { 
  tableName: 'chatlogs', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ fields: ['case_id'] }]
});

export default Chatlog;
