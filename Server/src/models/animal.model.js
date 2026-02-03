import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Animal = sequelize.define('Animal', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  farmer_id: { 
    type: DataTypes.INTEGER,
    allowNull: false 
  },
  tag_number: { 
    type: DataTypes.STRING,
    unique: true // Tag numbers are usually unique per animal
  },
  species: { 
    type: DataTypes.STRING 
  },
  breed: { 
    type: DataTypes.STRING 
  },
  age: { 
    type: DataTypes.INTEGER 
  },
  gender: { 
    type: DataTypes.STRING 
  },
  health_status: { 
    type: DataTypes.STRING,
    defaultValue: 'healthy' 
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'animals', 
  timestamps: false 
});

// Use export default for ESM compatibility
export default Animal;