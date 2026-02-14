import twilio from 'twilio';
import SMSLog from '../models/smsLog.model.js';
import User from '../models/user.model.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async ({ user_id, phone, message }) => {
  try {
    // Check opt-in preference
    if (user_id) {
      const user = await User.findByPk(user_id);
      if (user && !user.sms_opt_in) {
        console.log(`User ${user_id} has opted out of SMS notifications.`);
        return;
      }
    }

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    await SMSLog.create({
      user_id,
      phone,
      message,
      status: 'sent',
      sent_at: new Date()
    });

    return response;
  } catch (error) {
    await SMSLog.create({
      user_id,
      phone,
      message,
      status: 'failed',
      sent_at: new Date(),
      error_message: error.message
    });
    console.error('SMS send error:', error);
    throw error;
  }
};