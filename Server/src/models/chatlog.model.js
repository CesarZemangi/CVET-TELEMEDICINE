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
    allowNull: false
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
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'chatlogs', 
  timestamps: false 
});

export default Chatlog;
