import bcrypt from "bcryptjs";
import User from "./src/models/user.model.js";
import sequelize from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    const email = "admin@cvet.com";
    const hashedPassword = await bcrypt.hash("1234", 10);

    const [user, created] = await User.findOrCreate({
      where: { email: email.toLowerCase() },
      defaults: {
        name: "System Admin",
        password: hashedPassword,
        role: "admin",
        status: "active"
      }
    });

    if (created) {
      console.log("Admin user created successfully:");
      console.log(`Email: ${email}`);
      console.log("Password: 1234");
    } else {
      console.log("Admin user already exists.");
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
