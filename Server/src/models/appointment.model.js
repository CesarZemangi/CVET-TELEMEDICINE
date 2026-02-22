import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Appointment = sequelize.define('Appointment', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  case_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  farmer_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vet_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  appointment_date: { 
    type: DataTypes.DATE,
    allowNull: false
  },
  appointment_time: { 
    type: DataTypes.TIME,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  notes: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updated_by: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { 
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Appointment;
