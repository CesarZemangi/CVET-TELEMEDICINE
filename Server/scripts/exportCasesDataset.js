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
        c.id,
        c.symptoms,
        c.description,
        c.status,
        c.priority,
        c.created_at,
        c.updated_at,
        lr.result AS lab_result,
        p.medicine,
        p.dosage,
        p.duration
      FROM cases c
      LEFT JOIN lab_requests lq ON lq.case_id = c.id
      LEFT JOIN lab_results lr ON lr.lab_request_id = lq.lab_request_id
      LEFT JOIN prescriptions p ON p.case_id = c.id
      ORDER BY c.id ASC
    `);

    const outDir = path.join(process.cwd(), "ML", "data");
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "cases_export.csv");
    const headers = [
      "id",
      "symptoms",
      "description",
      "status",
      "priority",
      "created_at",
      "updated_at",
      "lab_result",
      "medicine",
      "dosage",
      "duration"
    ];

    const lines = [headers.join(",")];
    for (const row of rows) {
      lines.push(headers.map((h) => escapeCsv(row[h])).join(","));
    }
    fs.writeFileSync(outFile, lines.join("\n"), "utf8");
    console.log(`Dataset exported: ${outFile} (${rows.length} rows)`);
  } catch (err) {
    console.error("Export failed:", err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
