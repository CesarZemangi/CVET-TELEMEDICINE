import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AiPredictionLog = sequelize.define(
  "AiPredictionLog",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    case_id: { type: DataTypes.INTEGER, allowNull: true },
    vet_id: { type: DataTypes.INTEGER, allowNull: false },
    predicted_disease: { type: DataTypes.STRING(255), allowNull: false },
    confidence: { type: DataTypes.FLOAT, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    }
  },
  {
    tableName: "ai_prediction_logs",
    timestamps: false,
    indexes: [{ fields: ["vet_id"] }, { fields: ["case_id"] }, { fields: ["created_at"] }]
  }
);

export default AiPredictionLog;
