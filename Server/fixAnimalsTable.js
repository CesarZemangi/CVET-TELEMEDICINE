import sequelize from "./src/config/db.js";

const fixAnimalsTable = async () => {
  try {
    console.log("Attempting to add timestamp columns to animals table...");
    
    // Check if they exist first to avoid "Duplicate column" error
    const [cols] = await sequelize.query("DESCRIBE animals");
    const fieldNames = cols.map(c => c.Field);

    if (!fieldNames.includes('created_at')) {
      await sequelize.query("ALTER TABLE animals ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
      console.log("Added created_at");
    } else {
      // If it exists, update invalid values
      await sequelize.query("UPDATE animals SET created_at = CURRENT_TIMESTAMP WHERE created_at = '0000-00-00 00:00:00' OR created_at IS NULL");
      console.log("Updated invalid created_at values");
    }

    if (!fieldNames.includes('updated_at')) {
      await sequelize.query("ALTER TABLE animals ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
      console.log("Added updated_at");
    } else {
      // If it exists, update invalid values
      await sequelize.query("UPDATE animals SET updated_at = CURRENT_TIMESTAMP WHERE updated_at = '0000-00-00 00:00:00' OR updated_at IS NULL");
      console.log("Updated invalid updated_at values");
    }

    console.log("Table fix complete.");
    process.exit(0);
  } catch (err) {
    console.error("Fix failed:", err);
    process.exit(1);
  }
};

fixAnimalsTable();
