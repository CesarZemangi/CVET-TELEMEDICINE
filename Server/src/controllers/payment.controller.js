import crypto from "crypto";
import { Op } from "sequelize";
import { Payment, Appointment, User, Vet, Notification, Case, Animal } from "../models/associations.js";
import { success, error } from "../utils/response.js";
import { logAction } from "../utils/dbLogger.js";
import { sendEmail } from "../services/email.service.js";
import { sendSMS } from "../services/sms.service.js";
import { filterPaymentPayload, getPaymentAttributes, paymentColumnExists } from "../utils/paymentSchema.js";

const PAYMENT_METHODS = {
  ecocash: { method: "mobile_money", provider: "EcoCash" },
  onemoney: { method: "mobile_money", provider: "OneMoney" },
  mukuru: { method: "wallet", provider: "Mukuru" },
  zipit: { method: "bank_transfer", provider: "ZIPIT" },
  bank_transfer: { method: "bank_transfer", provider: "Bank Transfer" }
};

const isDemoPaymentsEnabled = () => String(process.env.DEMO_PAYMENTS_ENABLED || "").toLowerCase() === "true";

const PAYMENT_DETAIL_ATTRIBUTES = [
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

const PAYMENT_LIST_INCLUDE = [
  {
    model: User,
    as: "farmer",
    attributes: ["id", "name", "email", "phone"]
  },
  {
    model: Vet,
    as: "vet",
    attributes: ["id", "user_id"],
    include: [{ model: User, attributes: ["id", "name", "email", "phone"] }]
  },
  {
    model: Appointment,
    as: "appointment",
    include: [
      {
        model: Case,
        attributes: ["id", "title", "description", "animal_id"],
        include: [{ model: Animal, attributes: ["id", "tag_number", "species"] }]
      }
    ]
  },
  {
    model: User,
    as: "verifier",
    attributes: ["id", "name", "email"],
    required: false
  }
];

function normalizePaymentMethod(paymentMethod, paymentProvider) {
  const providerKey = String(paymentProvider || paymentMethod || "").trim().toLowerCase();
  const mapped = PAYMENT_METHODS[providerKey];

  if (mapped) {
    return mapped;
  }

  return {
    method: String(paymentMethod || "other").trim().toLowerCase() || "other",
    provider: paymentProvider || paymentMethod || "Other"
  };
}

function getPaymentInstructions(payment) {
  const provider = payment.payment_provider || payment.payment_method;
  if (payment.payment_method === "mobile_money") {
    return `Use ${provider} on ${payment.phone_number || "your registered number"} to complete the mobile money prompt.`;
  }

  if (payment.payment_method === "bank_transfer") {
    return "Transfer the consultation fee to CVET Telemedicine. Upload your receipt or screenshot so an administrator can verify the payment.";
  }

  return `Complete the payment using ${provider}. Keep the provider reference for verification.`;
}

async function sendVerifiedNotifications(payment) {
  const vetName = payment.vet?.User?.name || "your veterinarian";

  await Notification.create({
    receiver_id: payment.farmer_id,
    title: "Payment Verified",
    message: `Your payment of ${payment.amount} for the consultation with ${vetName} has been verified.`,
    type: "payment",
    is_read: false
  });

  await Notification.create({
    receiver_id: payment.vet?.user_id,
    title: "Consultation Paid",
    message: `Appointment #${payment.appointment_id} has been paid and is ready for consultation.`,
    type: "payment",
    is_read: false
  });

  if (payment.farmer?.email) {
    await sendEmail({
      user_id: payment.farmer_id,
      to: payment.farmer.email,
      subject: "Consultation Payment Confirmed",
      message: `Dear ${payment.farmer.name}, your payment for appointment #${payment.appointment_id} has been verified. Your consultation is now confirmed.`
    });
  }

  await sendSMS({
    user_id: payment.farmer_id,
    message: `CVET: Payment received. Appointment #${payment.appointment_id} is confirmed.`
  });
}

async function sendReceiptEmail(payment) {
  if (!payment?.farmer?.email) {
    return;
  }

  const receiptNumber = payment.payment_reference_number || payment.transaction_reference;
  const verifiedAt = payment.verified_at ? new Date(payment.verified_at).toLocaleString() : new Date().toLocaleString();
  const title = "Consultation Payment Receipt";

  await sendEmail({
    user_id: payment.farmer_id,
    to: payment.farmer.email,
    subject: title,
    message: `${title}\nReceipt: ${receiptNumber}\nAppointment: #${payment.appointment_id}\nAmount: ${payment.amount}\nMethod: ${payment.payment_provider || payment.payment_method}\nVerified: ${verifiedAt}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>${title}</h2>
        <p><strong>Receipt number:</strong> ${receiptNumber}</p>
        <p><strong>Appointment:</strong> #${payment.appointment_id}</p>
        <p><strong>Vet:</strong> ${payment.vet?.User?.name || "Assigned vet"}</p>
        <p><strong>Amount:</strong> ${payment.amount}</p>
        <p><strong>Method:</strong> ${payment.payment_provider || payment.payment_method}</p>
        <p><strong>Verified at:</strong> ${verifiedAt}</p>
      </div>
    `
  });
}

function isDemoPayment(payment) {
  return String(payment?.transaction_reference || "").startsWith("DEMO-PAY-")
    || String(payment?.admin_notes || "").toLowerCase().includes("demo payment");
}

function buildReceiptHtml(payment) {
  const isDemo = isDemoPayment(payment);
  const vetName = payment.vet?.User?.name || "Assigned vet";
  const farmerName = payment.farmer?.name || "Farmer";
  const reference = payment.payment_reference_number || payment.transaction_reference;
  const verifiedAt = payment.verified_at ? new Date(payment.verified_at).toLocaleString() : "Pending verification";
  const createdAt = payment.created_at ? new Date(payment.created_at).toLocaleString() : "N/A";
  const demoBanner = isDemo
    ? `<div style="background:#eaf7ef;color:#228B22;padding:12px 16px;border-radius:12px;margin-bottom:18px;font-weight:600;">Demonstration payment receipt. No real money was transferred.</div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CVET Payment Receipt</title>
  </head>
  <body style="margin:0;background:#f8faff;font-family:Arial,sans-serif;color:#001F3F;">
    <div style="max-width:760px;margin:32px auto;padding:24px;">
      <div style="background:linear-gradient(180deg,#228B22 0%,#1E90FF 100%);color:#fff;border-radius:18px;padding:24px 28px;margin-bottom:20px;">
        <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.9;">CVET Telemedicine</div>
        <h1 style="margin:10px 0 0;font-size:28px;">Payment Receipt</h1>
      </div>
      ${demoBanner}
      <div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 8px 30px rgba(0,31,63,.08);">
        <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;">
          <div>
            <div style="font-size:12px;color:#576574;text-transform:uppercase;">Receipt Number</div>
            <div style="font-size:18px;font-weight:700;">${reference}</div>
          </div>
          <div>
            <div style="font-size:12px;color:#576574;text-transform:uppercase;">Status</div>
            <div style="font-size:18px;font-weight:700;color:${payment.payment_status === "paid" ? "#228B22" : "#1E90FF"};">${payment.payment_status}</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#576574;">Farmer</td><td style="padding:10px 0;font-weight:600;text-align:right;">${farmerName}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Veterinarian</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">${vetName}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Appointment</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">#${payment.appointment_id}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Amount</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">USD ${Number(payment.amount || 0).toFixed(2)}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Method</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">${payment.payment_provider || payment.payment_method}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Submitted</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">${createdAt}</td></tr>
          <tr><td style="padding:10px 0;color:#576574;border-top:1px solid #edf2f7;">Verified</td><td style="padding:10px 0;font-weight:600;text-align:right;border-top:1px solid #edf2f7;">${verifiedAt}</td></tr>
        </table>
      </div>
    </div>
  </body>
</html>`;
}

async function applyVerifiedPayment(payment, verifierId, options = {}) {
  const { adminNote = null } = options;
  const fields = [];

  payment.payment_status = "paid";
  fields.push("payment_status");

  if (await paymentColumnExists("verified_by")) {
    payment.verified_by = verifierId;
    fields.push("verified_by");
  }

  if (await paymentColumnExists("verified_at")) {
    payment.verified_at = new Date();
    fields.push("verified_at");
  }

  if (await paymentColumnExists("rejection_reason")) {
    payment.rejection_reason = null;
    fields.push("rejection_reason");
  }

  if (adminNote && await paymentColumnExists("admin_notes")) {
    payment.admin_notes = adminNote;
    fields.push("admin_notes");
  }

  await payment.save({ fields });

  const appointment = await Appointment.findByPk(payment.appointment_id);
  if (appointment) {
    const nextStatus = appointment.status === "pending" ? "approved" : appointment.status;
    await appointment.update({
      status: nextStatus,
      updated_by: verifierId
    });
  }

  const hydratedPayment = await Payment.findByPk(payment.id, {
    attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
    include: PAYMENT_LIST_INCLUDE
  });

  await sendVerifiedNotifications(hydratedPayment);
  await sendReceiptEmail(hydratedPayment);
  await logAction(verifierId, `Payment ${payment.transaction_reference} verified`);

  return hydratedPayment;
}

export const initiatePayment = async (req, res) => {
  try {
    const {
      appointment_id,
      amount,
      payment_method,
      payment_provider,
      phone_number,
      payment_reference_number
    } = req.body;
    const farmer_id = req.user.id;

    if (!appointment_id || !amount || !payment_method) {
      return error(res, "appointment_id, amount, and payment_method are required", 400);
    }

    const appointment = await Appointment.findByPk(appointment_id, {
      include: [
        {
          model: Vet,
          as: "vet",
          attributes: ["id", "user_id"],
          include: [{ model: User, attributes: ["id", "name"] }]
        }
      ]
    });

    if (!appointment) {
      return error(res, "Appointment not found", 404);
    }

    if (appointment.farmer_id !== farmer_id) {
      return error(res, "Unauthorized: this appointment does not belong to you", 403);
    }

    if (["cancelled", "completed", "rejected"].includes(appointment.status)) {
      return error(res, `Cannot pay for an appointment with status ${appointment.status}`, 400);
    }

    const existingPayment = await Payment.findOne({
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      where: {
        appointment_id,
        payment_status: {
          [Op.in]: ["pending", "paid"]
        }
      }
    });

    if (existingPayment?.payment_status === "paid") {
      // Ensure appointment reflects paid state automatically
      await Appointment.update(
        { status: "approved", updated_by: farmer_id },
        { where: { id: appointment_id, status: "pending" } }
      );
      return success(res, { payment: existingPayment, already_paid: true }, "Payment already verified");
    }

    if (existingPayment?.payment_status === "pending") {
      return success(res, { payment: existingPayment, payment_instructions: getPaymentInstructions(existingPayment) }, "Payment already submitted and awaiting verification");
    }

    const normalized = normalizePaymentMethod(payment_method, payment_provider);
    const transaction_reference = `PAY-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;
    const proof_of_payment_url = req.file ? `/storage/uploads/payments/${req.file.filename}` : null;

    const paymentPayload = await filterPaymentPayload({
      farmer_id,
      vet_id: appointment.vet_id,
      appointment_id,
      amount,
      payment_method: normalized.method,
      payment_provider: normalized.provider,
      phone_number: phone_number || null,
      payment_reference_number: payment_reference_number || null,
      proof_of_payment_url,
      payment_status: "pending",
      transaction_reference
    });
    const payment = await Payment.create(paymentPayload);

    await logAction(farmer_id, `Farmer initiated payment of ${amount} for appointment #${appointment_id}`);

    if (isDemoPaymentsEnabled()) {
      const completedPayment = await applyVerifiedPayment(payment, farmer_id, {
        adminNote: "Payment auto-confirmed in demonstration mode."
      });

      return success(
        res,
        {
          payment: completedPayment,
          payment_instructions: "Payment completed successfully."
        },
        "Payment completed successfully"
      );
    }

    return success(
      res,
      {
        payment,
        payment_instructions: getPaymentInstructions(payment)
      },
      "Payment submitted successfully"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (!["admin"].includes(req.user.role)) {
      return error(res, "Only admins can verify payments", 403);
    }

    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES)
    });

    if (!payment) {
      return error(res, "Payment not found", 404);
    }

    if (payment.payment_status === "paid") {
      const hydrated = await Payment.findByPk(payment.id, {
        attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
        include: PAYMENT_LIST_INCLUDE
      });
      return success(res, hydrated, "Payment already verified");
    }

    const hydratedPayment = await applyVerifiedPayment(payment, req.user.id);
    return success(res, hydratedPayment, "Payment verified successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const rejectPayment = async (req, res) => {
  try {
    if (!["admin"].includes(req.user.role)) {
      return error(res, "Only admins can reject payments", 403);
    }

    const { id } = req.params;
    const { reason, admin_notes } = req.body;
    const payment = await Payment.findByPk(id, {
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE
    });

    if (!payment) {
      return error(res, "Payment not found", 404);
    }

    const fields = ["payment_status"];
    payment.payment_status = "rejected";
    if (await paymentColumnExists("rejection_reason")) {
      payment.rejection_reason = reason || "Payment proof was rejected";
      fields.push("rejection_reason");
    }
    if (await paymentColumnExists("admin_notes")) {
      payment.admin_notes = admin_notes || payment.admin_notes;
      fields.push("admin_notes");
    }
    if (await paymentColumnExists("verified_by")) {
      payment.verified_by = req.user.id;
      fields.push("verified_by");
    }
    if (await paymentColumnExists("verified_at")) {
      payment.verified_at = new Date();
      fields.push("verified_at");
    }
    await payment.save({ fields });

    const appointment = await Appointment.findByPk(payment.appointment_id);
    if (appointment) {
      await appointment.update({
        updated_by: req.user.id
      });
    }

    await Notification.create({
      receiver_id: payment.farmer_id,
      title: "Payment Rejected",
      message: payment.rejection_reason,
      type: "payment",
      is_read: false
    });

    await logAction(req.user.id, `Payment ${payment.transaction_reference} rejected`);
    return success(res, payment, "Payment rejected successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const payment = await Payment.findOne({
      where: { appointment_id },
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE
    });

    if (!payment) {
      return error(res, "Payment not found", 404);
    }

    if (req.user.role === "farmer" && payment.farmer_id !== req.user.id) {
      return error(res, "Forbidden", 403);
    }

    if (req.user.role === "vet") {
      const vet = await Vet.findOne({ where: { user_id: req.user.id } });
      if (!vet || vet.id !== payment.vet_id) {
        return error(res, "Forbidden", 403);
      }
    }

    return success(res, payment, "Payment status fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { farmer_id: req.user.id },
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE,
      order: [["created_at", "DESC"]]
    });

    return success(res, payments, "Payments fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getAdminPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return error(res, "Forbidden", 403);
    }

    const where = {};
    if (req.query.status) {
      where.payment_status = req.query.status;
    }

    const payments = await Payment.findAll({
      where,
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE,
      order: [["created_at", "DESC"]]
    });

    return success(res, payments, "Payments fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getVetPayments = async (req, res) => {
  try {
    const vet = await Vet.findOne({ where: { user_id: req.user.id } });
    if (!vet) {
      return error(res, "Vet record not found", 404);
    }

    const payments = await Payment.findAll({
      where: { vet_id: vet.id },
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE,
      order: [["created_at", "DESC"]]
    });

    const summary = payments.reduce(
      (acc, payment) => {
        const amount = Number(payment.amount) || 0;
        if (payment.payment_status === "paid") {
          acc.total_earnings += amount;
          acc.paid_consultations += 1;
        } else if (payment.payment_status === "pending") {
          acc.pending_consultations += 1;
        }
        return acc;
      },
      { total_earnings: 0, paid_consultations: 0, pending_consultations: 0 }
    );

    return success(res, { payments, summary }, "Vet payments fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const downloadPaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      attributes: await getPaymentAttributes(PAYMENT_DETAIL_ATTRIBUTES),
      include: PAYMENT_LIST_INCLUDE
    });

    if (!payment) {
      return error(res, "Payment not found", 404);
    }

    if (req.user.role === "farmer" && payment.farmer_id !== req.user.id) {
      return error(res, "Forbidden", 403);
    }

    if (req.user.role === "vet") {
      const vet = await Vet.findOne({ where: { user_id: req.user.id } });
      if (!vet || vet.id !== payment.vet_id) {
        return error(res, "Forbidden", 403);
      }
    }

    const fileName = `payment-receipt-${payment.id}.html`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.send(buildReceiptHtml(payment));
  } catch (err) {
    return error(res, err.message);
  }
};
