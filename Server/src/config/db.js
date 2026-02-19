import { Sequelize } from "sequelize";

const sequelize = new Sequelize("cvet_db", "root", "", {
  host: "localhost",
  dialect: "mysql", // Sequelize uses mysql2 under the hood
  logging: false,   // Keeps your console clean
  dialectOptions: {
    // This allows MySQL to handle '0000-00-00 00:00:00' without erroring in strict mode
    dateStrings: true,
    typeCast: true,
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
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