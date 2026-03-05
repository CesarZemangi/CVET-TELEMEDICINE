import sequelize from "../src/config/db.js";

const ensure = async () => {
  try {
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'password_reset_tokens'");
    if (!tables.length) {
      throw new Error("Table password_reset_tokens does not exist.");
    }

    const [idxRows] = await sequelize.query("SHOW INDEX FROM password_reset_tokens");
    const hasTokenUnique = idxRows.some((r) => r.Column_name === "token" && r.Non_unique === 0);
    if (!hasTokenUnique) {
      await sequelize.query("ALTER TABLE password_reset_tokens ADD UNIQUE KEY uq_password_reset_token (token)");
      console.log("Added unique index on token.");
    }

    const [idxRowsAfterUnique] = await sequelize.query("SHOW INDEX FROM password_reset_tokens");
    const hasTokenIndex = idxRowsAfterUnique.some((r) => r.Column_name === "token");
    const hasOnlyPrimary = idxRowsAfterUnique.every((r) => r.Key_name === "PRIMARY");
    if (!hasTokenIndex || hasOnlyPrimary) {
      await sequelize.query("CREATE INDEX idx_password_reset_token ON password_reset_tokens(token)");
      console.log("Added index on token.");
    }

    const [fkRows] = await sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'password_reset_tokens'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users'
        AND REFERENCED_COLUMN_NAME = 'id'
    `);
    if (!fkRows.length) {
      await sequelize.query(`
        ALTER TABLE password_reset_tokens
        ADD CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log("Added foreign key password_reset_tokens.user_id -> users.id");
    }

    console.log("password_reset_tokens checks complete.");
  } catch (err) {
    console.error("ensurePasswordResetTable failed:", err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

ensure();
