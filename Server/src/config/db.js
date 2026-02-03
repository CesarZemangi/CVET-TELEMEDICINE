import { Sequelize } from "sequelize";

const sequelize = new Sequelize("cvet_db", "root", "", {
  host: "localhost",
  dialect: "mysql", // Sequelize uses mysql2 under the hood
  logging: false,   // Keeps your console clean
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection (optional but helpful)
try {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;