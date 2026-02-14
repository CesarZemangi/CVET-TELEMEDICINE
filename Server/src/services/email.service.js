import nodemailer from 'nodemailer';
import EmailLog from '../models/emailLog.model.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async ({ user_id, to, subject, message }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`
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
    throw error;
  }
};