import sequelize from "./src/config/db.js";

const fixConstraints = async () => {
  try {
    console.log("Truncating tables to clear invalid data...");
    const truncateQueries = [
      "SET FOREIGN_KEY_CHECKS = 0",
      "TRUNCATE TABLE messages",
      "TRUNCATE TABLE video_sessions",
      "TRUNCATE TABLE email_logs",
      "TRUNCATE TABLE sms_logs",
      "TRUNCATE TABLE preventive_reminders",
      "TRUNCATE TABLE system_logs",
      "TRUNCATE TABLE consultations",
      "TRUNCATE TABLE lab_results",
      "TRUNCATE TABLE lab_requests",
      "TRUNCATE TABLE cases",
      "TRUNCATE TABLE animals",
      "SET FOREIGN_KEY_CHECKS = 1"
    ];

    for (const q of truncateQueries) {
      await sequelize.query(q);
    }

    console.log("Dropping old constraints...");
    
    const dropQueries = [
      "ALTER TABLE cases DROP FOREIGN KEY IF EXISTS cases_ibfk_1",
      "ALTER TABLE cases DROP FOREIGN KEY IF EXISTS cases_ibfk_2",
      "ALTER TABLE cases DROP FOREIGN KEY IF EXISTS cases_ibfk_3",
      "ALTER TABLE cases DROP FOREIGN KEY IF EXISTS cases_ibfk_4",
      "ALTER TABLE cases DROP FOREIGN KEY IF EXISTS cases_ibfk_5",
      "ALTER TABLE animals DROP FOREIGN KEY IF EXISTS animals_ibfk_1",
      "ALTER TABLE consultations DROP FOREIGN KEY IF EXISTS consultations_ibfk_1",
      "ALTER TABLE consultations DROP FOREIGN KEY IF EXISTS consultations_ibfk_2"
    ];

    for (const q of dropQueries) {
      try {
        await sequelize.query(q);
      } catch (e) {
        console.warn(`Warning: ${q} failed (possibly already dropped)`);
      }
    }

    console.log("Adding clean constraints...");
    
    const addQueries = [
      // Animals -> Users
      "ALTER TABLE animals ADD CONSTRAINT fk_animal_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE",
      // Cases -> Users (Farmer)
      "ALTER TABLE cases ADD CONSTRAINT fk_case_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE",
      // Cases -> Users (Vet)
      "ALTER TABLE cases ADD CONSTRAINT fk_case_vet FOREIGN KEY (vet_id) REFERENCES users(id) ON DELETE SET NULL",
      // Cases -> Animals
      "ALTER TABLE cases ADD CONSTRAINT fk_case_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE",
      // Consultations -> Cases
      "ALTER TABLE consultations ADD CONSTRAINT fk_consult_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE",
      // Consultations -> Users (Vet)
      "ALTER TABLE consultations ADD CONSTRAINT fk_consult_vet FOREIGN KEY (vet_id) REFERENCES users(id) ON DELETE SET NULL"
    ];

    for (const q of addQueries) {
      await sequelize.query(q);
    }

    console.log("Schema fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to fix schema:", err);
    process.exit(1);
  }
};

fixConstraints();