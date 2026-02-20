import sequelize from "./src/config/db.js";

const countAnimals = async () => {
  try {
    const [rows] = await sequelize.query("SELECT COUNT(*) as count FROM animals");
    console.log('ANIMALS COUNT:', rows[0].count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

countAnimals();
