import sequelize from './src/config/db.js';

const expectedTimestamps = {
  'feed_inventory': ['created_at', 'updated_at'],
  'lab_requests': ['created_at', 'updated_at'],
  'treatment_plans': ['created_at'],
  'prescriptions': [], // Model says false
  'vets': [], // Model says false
  'farmers': [] // Model says false
};

(async () => {
  try {
    for (const [table, cols] of Object.entries(expectedTimestamps)) {
      const [existingCols] = await sequelize.query(`DESCRIBE ${table}`);
      const colNames = existingCols.map(c => c.Field);
      
      for (const col of cols) {
        if (!colNames.includes(col)) {
          console.log(`Adding missing column ${col} to ${table}...`);
          await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${col} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        }
      }
    }

    const [tables] = await sequelize.query("SHOW TABLES");
    const tableList = tables.map(t => Object.values(t)[0]);
    
    for (const table of tableList) {
      const [cols] = await sequelize.query(`DESCRIBE ${table}`);
      const dateCols = cols.filter(c => 
        c.Type.toLowerCase().includes('datetime') || 
        c.Type.toLowerCase().includes('timestamp') || 
        c.Type.toLowerCase().includes('date')
      ).map(c => c.Field);
      
      for (const col of dateCols) {
        console.log(`Ensuring valid values for ${table}.${col}...`);
        try {
           await sequelize.query(`UPDATE ${table} SET ${col} = CURRENT_TIMESTAMP WHERE ${col} = '0000-00-00 00:00:00' OR ${col} IS NULL`);
        } catch (e) {}
        
        try {
           await sequelize.query(`ALTER TABLE ${table} MODIFY ${col} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        } catch (e) {}
      }
    }
    console.log("Done fixing tables.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();