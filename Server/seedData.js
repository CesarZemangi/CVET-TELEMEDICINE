import sequelize from "./src/config/db.js";
import User from "./src/models/user.model.js";
import Animal from "./src/models/animal.model.js";
import Case from "./src/models/case.model.js";
import LabRequest from "./src/models/labRequest.model.js";
import Consultation from "./src/models/consultation.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    const pwd = await bcrypt.hash("1234", 10);
    
    // Create Users
    const [farmerUser] = await User.findOrCreate({
      where: { email: "farmer@test.com" },
      defaults: { name: "Test Farmer", password: pwd, role: "farmer", status: "active" }
    });

    const [vetUser] = await User.findOrCreate({
      where: { email: "vet@test.com" },
      defaults: { name: "Dr. Smith", password: pwd, role: "vet", status: "active" }
    });

    // Link to roles tables
    await sequelize.query("INSERT IGNORE INTO farmers (user_id) VALUES (?)", { replacements: [farmerUser.id] });
    await sequelize.query("INSERT IGNORE INTO vets (user_id) VALUES (?)", { replacements: [vetUser.id] });

    // Get the IDs from farmers and vets tables
    const [farmerRows] = await sequelize.query("SELECT id FROM farmers WHERE user_id = ?", { replacements: [farmerUser.id] });
    const [vetRows] = await sequelize.query("SELECT id FROM vets WHERE user_id = ?", { replacements: [vetUser.id] });

    const farmerId = farmerRows[0].id;
    const vetId = vetRows[0].id;

    // Create Animals
    const [animal] = await Animal.findOrCreate({
      where: { tag_number: "TAG001" },
      defaults: { farmer_id: farmerId, species: "Cattle", breed: "Brahman", age: 3, health_status: 'healthy' }
    });

    // Create Cases
    const [caseItem] = await Case.findOrCreate({
      where: { symptoms: "The cow is limping since morning" },
      defaults: { farmer_id: farmerId, animal_id: animal.id, status: "open" }
    });

    // Create Lab Requests
    await LabRequest.findOrCreate({
      where: { case_id: caseItem.id },
      defaults: { requested_by: vetId, test_type: "Blood Test", status: "pending" }
    });

    // Create Consultations
    await Consultation.findOrCreate({
      where: { case_id: caseItem.id },
      defaults: { vet_id: vetId, mode: "chat", notes: "Initial discussion" }
    });

    console.log("Sample data seeded successfully.");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
