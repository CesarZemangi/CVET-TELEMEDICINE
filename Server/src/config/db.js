import { Sequelize } from "sequelize";

const {
  DB_NAME = "cvet_db",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306"
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    // Allow MySQL to handle zero dates without strict errors
    dateStrings: true,
    typeCast: true
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
