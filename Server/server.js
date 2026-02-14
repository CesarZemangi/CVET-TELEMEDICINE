import 'dotenv/config'; // This must be the first line
import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";
import sequelize from "./src/config/db.js";
import socketService from "./src/services/socket.service.js";
import { initReminderJob } from "./src/services/reminder.service.js";
import "./src/models/associations.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
socketService(server);

// Initialize Reminder Automation
initReminderJob();

const startServer = async () => {
  try {
    // 1. Test connection and sync models to the database
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("All models synced successfully.");

    // 2. Start the Server
    server.listen(PORT, () => {
      console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Listening on port: ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to start server:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();