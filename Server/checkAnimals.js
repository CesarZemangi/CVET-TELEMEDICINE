import sequelize from "./src/config/db.js";

const checkAnimalsSchema = async () => {
  try {
    const [cols] = await sequelize.query("DESCRIBE animals");
    console.log('ANIMALS TABLE:', JSON.stringify(cols, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAnimalsSchema();
