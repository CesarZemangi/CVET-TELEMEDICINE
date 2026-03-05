import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PasswordResetToken = sequelize.define(
  "PasswordResetToken",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "password_reset_tokens",
    timestamps: false,
    paranoid: false,
    indexes: [{ fields: ["token"] }]
  }
);

export default PasswordResetToken;
