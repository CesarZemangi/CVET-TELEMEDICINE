import dotenv from "dotenv";
import app from "./src/app.js";
import sequelize from "./src/config/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start Server with Database Synchronization
 * sequelize.sync({ alter: true }) ensures your tables match your models 
 * without deleting data (adds new columns if needed).
 */
const startServer = async () => {
  try {
    // 1. Test connection and sync models to the database
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Sync models (Farmer, Animal, Feedback, etc.)
    await sequelize.sync({ alter: true });
    console.log("All models synced successfully.");

    // 2. Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Listening on port: ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to start server:");
    console.error(error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();