import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VideoSession = sequelize.define('VideoSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  farmer_id: { type: DataTypes.INTEGER },
  vet_id: { type: DataTypes.INTEGER },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ended_at: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('active', 'ended', 'missed'), defaultValue: 'active' }
}, { tableName: 'video_sessions', timestamps: false });

export default VideoSession;