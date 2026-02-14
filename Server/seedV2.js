import sequelize from "./src/config/db.js";
import "./src/models/associations.js"; // Initialize associations
import User from "./src/models/user.model.js";
import Animal from "./src/models/animal.model.js";
import Case from "./src/models/case.model.js";
import LabRequest from "./src/models/labRequest.model.js";
import Consultation from "./src/models/consultation.model.js";
import Message from "./src/models/message.model.js";
import VideoSession from "./src/models/videoSession.model.js";
import EmailLog from "./src/models/emailLog.model.js";
import SMSLog from "./src/models/smsLog.model.js";
import PreventiveReminder from "./src/models/preventiveReminder.model.js";
import SystemLog from "./src/models/systemLog.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Sync models (optional, but ensures tables exist)
    await sequelize.sync({ alter: true });

    const pwd = await bcrypt.hash("1234", 10);
    
    // 1. Create Users (Farmers, Vets, Admin)
    const farmers = [];
    for (let i = 1; i <= 10; i++) {
      const [u] = await User.findOrCreate({
        where: { email: `farmer${i}@test.com` },
        defaults: { name: `Farmer ${i}`, password: pwd, role: "farmer", status: "active" }
      });
      // Insert into farmers table
      await sequelize.query("INSERT IGNORE INTO farmers (user_id, farm_name, location, livestock_count) VALUES (?, ?, ?, ?)", {
        replacements: [u.id, `Farm ${i}`, `Location ${i}`, 10 * i]
      });
      const [fRows] = await sequelize.query("SELECT id FROM farmers WHERE user_id = ?", { replacements: [u.id] });
      farmers.push({ userId: u.id, farmerId: fRows[0].id, email: u.email });
    }

    const vets = [];
    for (let i = 1; i <= 5; i++) {
      const [u] = await User.findOrCreate({
        where: { email: `vet${i}@test.com` },
        defaults: { name: `Dr. Vet ${i}`, password: pwd, role: "vet", status: "active" }
      });
      // Insert into vets table
      await sequelize.query("INSERT IGNORE INTO vets (user_id, specialization, license_number, experience_years) VALUES (?, ?, ?, ?)", {
        replacements: [u.id, "General Practice", `LIC-${u.id}`, i * 2]
      });
      const [vRows] = await sequelize.query("SELECT id FROM vets WHERE user_id = ?", { replacements: [u.id] });
      vets.push({ userId: u.id, vetId: vRows[0].id, email: u.email });
    }

    const [admin] = await User.findOrCreate({
      where: { email: "admin@test.com" },
      defaults: { name: "System Admin", password: pwd, role: "admin", status: "active" }
    });

    // 2. Create Animals for Farmers
    const animals = [];
    for (const farmer of farmers) {
      const numAnimals = Math.floor(Math.random() * 5) + 1;
      for (let j = 1; j <= numAnimals; j++) {
        const a = await Animal.create({
          farmer_id: farmer.farmerId, // Use Farmer ID, not User ID
          tag_number: `TAG-${farmer.farmerId}-${j}`,
          species: j % 2 === 0 ? "Cattle" : "Goat",
          breed: "Local Mix",
          age: Math.floor(Math.random() * 10) + 1,
          health_status: Math.random() > 0.8 ? "sick" : "healthy"
        });
        animals.push(a);
      }
    }

    // 3. Create Cases
    const cases = [];
    for (const animal of animals) {
      if (animal.health_status === 'sick' || Math.random() > 0.5) {
        const selectedVet = vets[Math.floor(Math.random() * vets.length)];
        const c = await Case.create({
          farmer_id: animal.farmer_id,
          animal_id: animal.id,
          vet_id: selectedVet.vetId, // Use Vet ID, not User ID
          title: "Sickness Alert",
          description: "Animal showing signs of illness",
          symptoms: "Limping and low appetite",
          status: Math.random() > 0.3 ? "open" : "closed"
        });
        cases.push(c);
      }
    }

    // 4. Create Consultations, Lab Requests, Messages, Video Sessions
    for (const c of cases) {
      // Consultation
      await Consultation.create({
        case_id: c.id,
        vet_id: c.vet_id,
        mode: Math.random() > 0.5 ? "chat" : "video",
        notes: "Discussed symptoms and prescribed initial care."
      });

      // Lab Request (some cases)
      if (Math.random() > 0.6) {
        await LabRequest.create({
          case_id: c.id,
          requested_by: c.vet_id,
          test_type: "Blood Sample",
          status: Math.random() > 0.5 ? "completed" : "pending"
        });
      }

      // Messages (a few for each case)
      for (let m = 1; m <= 3; m++) {
        const sender = m % 2 === 0 ? farmers.find(f => f.farmerId === c.farmer_id) : vets.find(v => v.vetId === c.vet_id);
        const receiver = m % 2 === 0 ? vets.find(v => v.vetId === c.vet_id) : farmers.find(f => f.farmerId === c.farmer_id);
        
        await Message.create({
          case_id: c.id,
          sender_id: sender.userId,
          receiver_id: receiver.userId,
          message: `Test message ${m} for case ${c.id}`,
          created_at: new Date()
        });
      }

      // Video Sessions
      if (Math.random() > 0.7) {
        const f = farmers.find(f => f.farmerId === c.farmer_id);
        const v = vets.find(v => v.vetId === c.vet_id);
        await VideoSession.create({
          case_id: c.id,
          farmer_id: f.userId,
          vet_id: v.userId,
          status: "ended",
          started_at: new Date(),
          ended_at: new Date(Date.now() + 600000)
        });
      }
    }

    // 5. Logs and Notifications
    for (let l = 1; l <= 20; l++) {
      const f = farmers[l % farmers.length];
      await EmailLog.create({
        user_id: f.userId,
        email: f.email,
        subject: "Notification",
        message: "This is a test email log",
        status: "sent"
      });
      await SMSLog.create({
        user_id: f.userId,
        phone: "263770000000",
        message: "This is a test SMS log",
        status: "sent"
      });
      await SystemLog.create({
        user_id: admin.id,
        action: `Admin performed action ${l}`
      });
    }

    // 6. Reminders
    for (const farmer of farmers) {
      await PreventiveReminder.create({
        farmer_id: farmer.id,
        animal_id: animals.find(a => a.farmer_id === farmer.id).id,
        reminder_type: "Vaccination",
        description: "Yearly vaccination due",
        reminder_date: new Date(Date.now() + 86400000 * 7),
        status: "pending"
      });
    }

    console.log("Seeding V2 completed successfully.");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();