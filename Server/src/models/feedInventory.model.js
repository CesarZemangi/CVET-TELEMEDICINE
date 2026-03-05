import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FeedInventory = sequelize.define('FeedInventory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER, allowNull: false },
  feed_name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  unit: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'kg' },
  low_stock_threshold: { type: DataTypes.DECIMAL(10, 2), defaultValue: 10.00 },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  tableName: 'feed_inventory', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  indexes: [{ unique: true, fields: ['farmer_id', 'feed_name'] }]
});

export default FeedInventory;
