import fs from "fs";
import path from "path";
import sequelize from "../src/config/db.js";

const escapeCsv = (value) => {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const run = async () => {
  try {
    const [rows] = await sequelize.query(`
      SELECT
        p.id,
        p.farmer_id,
        p.vet_id,
        p.appointment_id,
        p.amount,
        p.payment_method,
        p.payment_provider,
        p.payment_status,
        p.payment_reference_number,
        p.transaction_reference,
        p.created_at,
        p.updated_at,
        p.verified_at,
        a.status AS appointment_status,
        a.appointment_date,
        a.appointment_time
      FROM payments p
      LEFT JOIN appointments a ON a.id = p.appointment_id
      ORDER BY p.id ASC
    `);

    const outDir = path.join(process.cwd(), "ML", "data");
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "payments_export.csv");
    const headers = [
      "id",
      "farmer_id",
      "vet_id",
      "appointment_id",
      "amount",
      "payment_method",
      "payment_provider",
      "payment_status",
      "payment_reference_number",
      "transaction_reference",
      "created_at",
      "updated_at",
      "verified_at",
      "appointment_status",
      "appointment_date",
      "appointment_time"
    ];

    const lines = [headers.join(",")];
    for (const row of rows) {
      lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
    }

    fs.writeFileSync(outFile, lines.join("\n"), "utf8");
    console.log(`Dataset exported: ${outFile} (${rows.length} rows)`);
  } catch (err) {
    console.error("Payment export failed:", err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
