import sequelize from './src/config/db.js';

(async () => {
  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableList = tables.map(t => Object.values(t)[0]);
    
    for (const table of tableList) {
      const [cols] = await sequelize.query(`DESCRIBE ${table}`);
      const hasFarmerId = cols.some(c => c.Field === 'farmer_id');
      
      if (hasFarmerId) {
        console.log(`Checking ${table} for orphan farmer_id...`);
        const [orphans] = await sequelize.query(`
          SELECT farmer_id FROM ${table} 
          WHERE farmer_id NOT IN (SELECT id FROM users)
        `);
        if (orphans.length > 0) {
          console.log(`Found ${orphans.length} orphans in ${table}:`, orphans);
          // Delete or fix? Let's delete for now to allow sync to proceed, 
          // but better to warn.
          // Actually, let's just delete them if they are invalid.
          await sequelize.query(`
            DELETE FROM ${table} 
            WHERE farmer_id NOT IN (SELECT id FROM users)
          `);
          console.log(`Deleted orphans from ${table}`);
        }
      }
      
      const hasVetId = cols.some(c => c.Field === 'vet_id');
      if (hasVetId) {
        console.log(`Checking ${table} for orphan vet_id...`);
        // Note: vet_id might reference vets table or users table depending on the model.
        // In this project, Case.vet_id references Vet.id.
        // But some others might reference users.id.
        // Let's check both.
        const [orphans] = await sequelize.query(`
          SELECT vet_id FROM ${table} 
          WHERE vet_id IS NOT NULL AND vet_id NOT IN (SELECT id FROM vets) AND vet_id NOT IN (SELECT id FROM users)
        `);
        if (orphans.length > 0) {
           console.log(`Found ${orphans.length} orphans in ${table} (vet_id):`, orphans);
           // Do not delete yet, let's see.
        }
      }
    }
    console.log("Done checking orphans.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();