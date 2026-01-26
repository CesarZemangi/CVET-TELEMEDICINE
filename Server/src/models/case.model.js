const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Case = sequelize.define('Case', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER },
  animal_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('open', 'closed') },
  priority: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'cases', timestamps: false });

module.exports = Case;
