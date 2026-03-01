import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CaseMedia = sequelize.define('CaseMedia', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  case_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cases',
      key: 'id'
    }
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: { 
    type: DataTypes.STRING(500),
    allowNull: false
  },
  file_type: { 
    type: DataTypes.STRING(100),
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, { 
  tableName: 'media_uploads', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at'
});

export default CaseMedia;
