import sequelize from "../src/config/db.js";
import { QueryTypes } from "sequelize";

const ensureVetRatingsTable = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS vet_ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vet_id INT NOT NULL,
      farmer_id INT NOT NULL,
      rating_value TINYINT NOT NULL,
      comment TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const getDuplicatesByUserId = async () => {
  return sequelize.query(
    `
      SELECT user_id, GROUP_CONCAT(id ORDER BY id ASC) AS vet_ids
      FROM vets
      WHERE deleted_at IS NULL
      GROUP BY user_id
      HAVING COUNT(*) > 1
    `,
    { type: QueryTypes.SELECT }
  );
};

const getTablesWithVetId = async () => {
  return sequelize.query(
    `
      SELECT table_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND column_name = 'vet_id'
        AND table_name <> 'vets'
    `,
    { type: QueryTypes.SELECT }
  );
};

const repointDuplicateVetReferences = async (duplicateRows) => {
  if (!duplicateRows.length) return;

  const tableRows = await getTablesWithVetId();
  const tableNames = tableRows.map((row) => row.table_name);

  for (const row of duplicateRows) {
    const ids = String(row.vet_ids || "")
      .split(",")
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (ids.length < 2) continue;
    const keeperId = ids[0];
    const duplicateIds = ids.slice(1);

    for (const tableName of tableNames) {
      await sequelize.query(
        `UPDATE ${tableName} SET vet_id = :keeperId WHERE vet_id IN (:duplicateIds)`,
        {
          replacements: { keeperId, duplicateIds },
          type: QueryTypes.UPDATE
        }
      );
    }

    await sequelize.query(
      `DELETE FROM vets WHERE id IN (:duplicateIds)`,
      {
        replacements: { duplicateIds },
        type: QueryTypes.DELETE
      }
    );
  }
};

const dropForeignKeysForColumn = async (tableName, columnName) => {
  const keys = await sequelize.query(
    `
      SELECT constraint_name
      FROM information_schema.key_column_usage
      WHERE table_schema = DATABASE()
        AND table_name = :tableName
        AND column_name = :columnName
        AND referenced_table_name IS NOT NULL
    `,
    {
      replacements: { tableName, columnName },
      type: QueryTypes.SELECT
    }
  );

  for (const key of keys) {
    await sequelize.query(`ALTER TABLE ${tableName} DROP FOREIGN KEY ${key.constraint_name}`);
  }
};

const ensureIndex = async ({ tableName, indexName, ddl }) => {
  const existing = await sequelize.query(
    `
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = :tableName
        AND index_name = :indexName
      LIMIT 1
    `,
    {
      replacements: { tableName, indexName },
      type: QueryTypes.SELECT
    }
  );

  if (existing.length === 0) {
    await sequelize.query(ddl);
  }
};

const ensureForeignKey = async ({ tableName, constraintName, ddl }) => {
  const existing = await sequelize.query(
    `
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = DATABASE()
        AND table_name = :tableName
        AND constraint_name = :constraintName
        AND constraint_type = 'FOREIGN KEY'
      LIMIT 1
    `,
    {
      replacements: { tableName, constraintName },
      type: QueryTypes.SELECT
    }
  );

  if (existing.length === 0) {
    await sequelize.query(ddl);
  }
};

const removeDuplicateVetRatings = async () => {
  await sequelize.query(
    `
      DELETE vr1
      FROM vet_ratings vr1
      INNER JOIN vet_ratings vr2
        ON vr1.vet_id = vr2.vet_id
       AND vr1.farmer_id = vr2.farmer_id
       AND vr1.id < vr2.id
    `,
    { type: QueryTypes.DELETE }
  );
};

const ensureNoVetProfileDuplicates = async () => {
  const duplicates = await getDuplicatesByUserId();
  if (duplicates.length > 0) {
    throw new Error("Duplicate vet profiles still exist after cleanup.");
  }
};

const stabilize = async () => {
  try {
    await ensureVetRatingsTable();

    const duplicateVets = await getDuplicatesByUserId();
    await repointDuplicateVetReferences(duplicateVets);
    await ensureNoVetProfileDuplicates();

    await removeDuplicateVetRatings();

    await dropForeignKeysForColumn("vet_ratings", "vet_id");
    await dropForeignKeysForColumn("vet_ratings", "farmer_id");

    await ensureIndex({
      tableName: "vets",
      indexName: "uq_vets_user_id",
      ddl: "ALTER TABLE vets ADD UNIQUE INDEX uq_vets_user_id (user_id)"
    });
    await ensureIndex({
      tableName: "vet_ratings",
      indexName: "uq_vet_ratings_vet_farmer",
      ddl: "ALTER TABLE vet_ratings ADD UNIQUE INDEX uq_vet_ratings_vet_farmer (vet_id, farmer_id)"
    });
    await ensureIndex({
      tableName: "vet_ratings",
      indexName: "idx_vet_ratings_vet_id",
      ddl: "ALTER TABLE vet_ratings ADD INDEX idx_vet_ratings_vet_id (vet_id)"
    });

    await ensureForeignKey({
      tableName: "vet_ratings",
      constraintName: "fk_vet_ratings_vet",
      ddl: "ALTER TABLE vet_ratings ADD CONSTRAINT fk_vet_ratings_vet FOREIGN KEY (vet_id) REFERENCES vets(id) ON DELETE CASCADE ON UPDATE CASCADE"
    });
    await ensureForeignKey({
      tableName: "vet_ratings",
      constraintName: "fk_vet_ratings_farmer",
      ddl: "ALTER TABLE vet_ratings ADD CONSTRAINT fk_vet_ratings_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE"
    });

    console.log("Vet ratings stabilization completed.");
    process.exit(0);
  } catch (err) {
    console.error("Vet ratings stabilization failed:", err.message);
    process.exit(1);
  }
};

stabilize();
