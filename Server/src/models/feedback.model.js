import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure this points to your database config file

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  consultation_id: { type: DataTypes.INTEGER },
  farmer_id: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER },
  comments: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  tableName: 'feedback', 
  timestamps: false 
});

export default Feedback;