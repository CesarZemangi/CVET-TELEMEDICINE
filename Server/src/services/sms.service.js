import SMSLog from '../models/smsLog.model.js';
import User from '../models/user.model.js';

/**
 * Send SMS to a user
 * @param {Object} params
 * @param {number} params.user_id
 * @param {string} params.message
 */
export const sendSMS = async ({ user_id, message }) => {
  let userPhone = 'Unknown';
  try {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error('User not found');
    
    userPhone = user.phone;
    if (!userPhone) throw new Error('User phone not available');
    
    // Check Opt-in
    if (!user.sms_opt_in) {
      console.log(`SMS skipped for user ${user_id}: Opted out`);
      return { success: false, reason: 'opt_out' };
    }

    // ACTUAL SMS API CALL LOGIC HERE (Twilio, Africa's Talking, etc.)
    // Example for Twilio:
    // const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body: message, to: userPhone, from: process.env.TWILIO_NUMBER });
    
    console.log(`[SMS MOCK] To: ${userPhone}, Message: ${message}`);
    
    // Log success
    await SMSLog.create({
      user_id,
      phone: userPhone,
      message,
      status: 'sent'
    });

    return { success: true };
  } catch (error) {
    console.error('SMS Send Error:', error);
    
    // Log failure
    await SMSLog.create({
      user_id: user_id || null,
      phone: userPhone,
      message,
      status: 'failed',
      error_message: error.message
    });
    
    return { success: false, error: error.message };
  }
};
