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
    allowNull: false
  },
  media_type: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  uploaded_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'case_media', 
  timestamps: false 
});

export default CaseMedia;
