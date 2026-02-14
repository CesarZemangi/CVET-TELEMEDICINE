import cron from 'node-cron';
import { Op } from 'sequelize';
import PreventiveReminder from '../models/preventiveReminder.model.js';
import User from '../models/user.model.js';
import { sendEmail } from './email.service.js';
import { sendSMS } from './sms.service.js';

export const initReminderJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running preventive reminders job...');
    try {
      const now = new Date();
      const reminders = await PreventiveReminder.findAll({
        where: {
          reminder_date: { [Op.lte]: now },
          status: 'pending'
        }
      });

      for (const reminder of reminders) {
        try {
          const farmer = await User.findByPk(reminder.farmer_id);
          if (!farmer) continue;

          const message = `Reminder: ${reminder.reminder_type} - ${reminder.description}`;

          // Send Email
          if (farmer.email) {
            await sendEmail({
              user_id: farmer.id,
              to: farmer.email,
              subject: `CVet Reminder: ${reminder.reminder_type}`,
              message
            }).catch(e => console.error('Reminder Email failed:', e));
          }

          // Send SMS
          if (farmer.phone) {
            await sendSMS({
              user_id: farmer.id,
              phone: farmer.phone,
              message
            }).catch(e => console.error('Reminder SMS failed:', e));
          }

          // Update status
          await reminder.update({
            status: 'sent',
            sent_at: new Date()
          });

        } catch (innerError) {
          console.error(`Error processing reminder ${reminder.id}:`, innerError);
        }
      }
    } catch (error) {
      console.error('Reminder job error:', error);
    }
  });
};