import nodemailer from 'nodemailer';
import EmailLog from '../models/emailLog.model.js';

const smtpAuthEnabled =
  String(process.env.SMTP_AUTH || "").toLowerCase() === "true" ||
  (Boolean(process.env.SMTP_USER) && Boolean(process.env.SMTP_PASS));

const transporterConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true", // true for 465, false for other ports
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000)
};

if (smtpAuthEnabled) {
  transporterConfig.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  };
}

const transporter = nodemailer.createTransport(transporterConfig);

export const sendEmail = async ({ user_id, to, subject, message, html = null }) => {
  try {
    if (!to || !subject || !message) {
      throw new Error("Email requires 'to', 'subject', and 'message'");
    }
    if (!process.env.SMTP_HOST) {
      throw new Error("SMTP_HOST is not configured");
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: message,
      html: html || `<p>${message}</p>`
    });

    await EmailLog.create({
      user_id,
      email: to,
      subject,
      message,
      status: 'sent',
      sent_at: new Date()
    });

    return info;
  } catch (error) {
    await EmailLog.create({
      user_id,
      email: to,
      subject,
      message,
      status: 'failed',
      sent_at: new Date(),
      error_message: error.message
    });
    console.error('Email send error:', error);
    if (process.env.NODE_ENV !== "production") {
      // Local/dev fallback: do not break request flows when SMTP is unavailable.
      return { mocked: true, error: error.message };
    }
    throw error;
  }
};
