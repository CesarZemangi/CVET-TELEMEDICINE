import sequelize from "./src/config/db.js";

const checkTables = async () => {
  try {
    const tables = ["cases", "animals", "users", "consultations", "lab_requests", "lab_results"];
    for (const table of tables) {
      const [cols] = await sequelize.query(`DESCRIBE ${table}`);
      console.log(`${table.toUpperCase()} TABLE:`, cols.map(c => c.Field));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkTables();
