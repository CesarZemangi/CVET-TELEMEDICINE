import sequelize from "../config/db.js";

const KNOWN_PAYMENT_COLUMNS = [
  "id",
  "farmer_id",
  "vet_id",
  "appointment_id",
  "amount",
  "payment_method",
  "payment_provider",
  "phone_number",
  "payment_status",
  "payment_reference_number",
  "transaction_reference",
  "proof_of_payment_url",
  "admin_notes",
  "rejection_reason",
  "verified_by",
  "verified_at",
  "created_at",
  "updated_at"
];

let cachedPaymentColumns = null;

export async function getPaymentColumns() {
  if (cachedPaymentColumns) {
    return cachedPaymentColumns;
  }

  try {
    const [rows] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'payments'
      ORDER BY ORDINAL_POSITION
    `);

    cachedPaymentColumns = new Set(rows.map((row) => row.COLUMN_NAME));
  } catch (error) {
    console.warn("Unable to inspect payment schema, falling back to legacy columns:", error.message);
    cachedPaymentColumns = new Set([
      "id",
      "farmer_id",
      "vet_id",
      "appointment_id",
      "amount",
      "payment_method",
      "payment_status",
      "transaction_reference",
      "created_at",
      "updated_at"
    ]);
  }

  return cachedPaymentColumns;
}

export async function paymentColumnExists(columnName) {
  const columns = await getPaymentColumns();
  return columns.has(columnName);
}

export async function getPaymentAttributes(requestedColumns = KNOWN_PAYMENT_COLUMNS) {
  const columns = await getPaymentColumns();
  return requestedColumns.filter((column) => columns.has(column));
}

export async function filterPaymentPayload(payload) {
  const columns = await getPaymentColumns();
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => columns.has(key) && value !== undefined)
  );
}
