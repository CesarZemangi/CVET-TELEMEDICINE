import sequelize from "./src/config/db.js";

const updateSchema = async () => {
  try {
    console.log("Updating database schema for new features...");

    // 1. Users Table
    const userTableQueries = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) NULL AFTER sms_opt_in",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER created_at"
    ];

    // 2. Soft Delete columns for other major tables
    const softDeleteQueries = [
      "ALTER TABLE cases ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER updated_at",
      "ALTER TABLE animals ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER updated_at",
      "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER updated_at",
      "ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER created_at",
      "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER created_at",
      "ALTER TABLE feed_inventory ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL AFTER updated_at",
      // Farmers and Vets
      "ALTER TABLE farmers ADD COLUMN IF NOT EXISTS created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE farmers ADD COLUMN IF NOT EXISTS updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      "ALTER TABLE farmers ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL",
      "ALTER TABLE vets ADD COLUMN IF NOT EXISTS created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE vets ADD COLUMN IF NOT EXISTS updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      "ALTER TABLE vets ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL"
    ];

    // 3. System Logs table updates
    const systemLogQueries = [
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS action_type VARCHAR(50) NOT NULL AFTER user_id",
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS module VARCHAR(50) NOT NULL AFTER action_type",
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS entity_id INT NULL AFTER module",
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS old_value JSON NULL AFTER action",
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS new_value JSON NULL AFTER old_value",
      "ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) NULL AFTER new_value"
    ];

    const allQueries = [...userTableQueries, ...softDeleteQueries, ...systemLogQueries];

    for (const query of allQueries) {
      try {
        console.log(`Executing: ${query}`);
        await sequelize.query(query);
      } catch (err) {
        if (err.parent?.code === 'ER_P_C_ALREADY_EXISTS' || err.parent?.code === 'ER_DUP_FIELDNAME') {
          console.warn(`Column already exists, skipping.`);
        } else {
          console.error(`Failed executing query: ${query}`, err.message);
        }
      }
    }

    console.log("Schema update completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Schema update failed:", err);
    process.exit(1);
  }
};

updateSchema();
