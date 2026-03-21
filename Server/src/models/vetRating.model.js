import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VetRating = sequelize.define("VetRating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vet_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  farmer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "vet_ratings",
  timestamps: false
});

export default VetRating;
