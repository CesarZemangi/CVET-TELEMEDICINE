import sequelize from "./src/config/db.js";

const fixDates = async () => {
  try {
    console.log("Fixing invalid dates in system_logs...");
    await sequelize.query("UPDATE system_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at = '0000-00-00 00:00:00'");
    await sequelize.query("UPDATE system_logs SET updated_at = CURRENT_TIMESTAMP WHERE updated_at = '0000-00-00 00:00:00'");
    
    // Also check other tables that might have this
    const tables = ['cases', 'animals', 'consultations', 'lab_results', 'lab_requests', 'video_sessions', 'chatlogs'];
    for (const table of tables) {
      try {
        await sequelize.query(`UPDATE ${table} SET created_at = CURRENT_TIMESTAMP WHERE created_at = '0000-00-00 00:00:00'`);
        await sequelize.query(`UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE updated_at = '0000-00-00 00:00:00'`);
      } catch (e) {
        console.warn(`Table ${table} might not have timestamps yet.`);
      }
    }
    
    console.log("Dates fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to fix dates:", err);
    process.exit(1);
  }
};

fixDates();
