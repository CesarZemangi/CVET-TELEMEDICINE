import { PreventiveReminder, Animal, Reminder } from '../models/associations.js';
import SystemLog from '../models/systemLog.model.js';
import { logAction } from '../utils/dbLogger.js';

export const createAdminReminder = async (req, res) => {
  try {
    const { title, message, target_role, schedule_date } = req.body;

    if (!title || !message || !target_role || !schedule_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reminder = await Reminder.create({
      title,
      message,
      target_role,
      schedule_date,
      created_by: req.user.id,
      status: 'scheduled'
    });

    await logAction(req.user.id, `Admin created reminder for ${target_role} role: "${title}"`);

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { animal_id, reminder_type, description, reminder_date } = req.body;
    const farmer_id = req.user.id;

    // Ensure animal belongs to farmer
    const animal = await Animal.findOne({ where: { id: animal_id, farmer_id } });
    if (!animal) {
      return res.status(403).json({ message: 'Animal not found or does not belong to you' });
    }

    // Ensure reminder_date is in the future
    if (new Date(reminder_date) <= new Date()) {
      return res.status(400).json({ message: 'Reminder date must be in the future' });
    }

    const reminder = await PreventiveReminder.create({
      farmer_id,
      animal_id,
      reminder_type,
      description,
      reminder_date,
      status: 'pending'
    });

    await logAction(farmer_id, `Farmer created preventive reminder for animal #${animal_id}: ${reminder_type}`);

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmerReminders = async (req, res) => {
  try {
    const farmer_id = req.params.id;
    
    // Authorization: Ensure farmer can only see their own reminders (unless admin)
    if (req.user.role !== 'admin' && req.user.id != farmer_id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const reminders = await PreventiveReminder.findAll({
      where: { farmer_id },
      include: [{ model: Animal, as: 'animal' }]
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminder_type, description, reminder_date, status } = req.body;
    const farmer_id = req.user.id;

    const reminder = await PreventiveReminder.findOne({ where: { id } });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Authorization: Only owner can update (unless admin)
    if (req.user.role !== 'admin' && reminder.farmer_id !== farmer_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (reminder_date && new Date(reminder_date) <= new Date()) {
        return res.status(400).json({ message: 'Reminder date must be in the future' });
    }

    await reminder.update({ reminder_type, description, reminder_date, status });

    if (req.user.role === 'admin') {
      await SystemLog.create({
        user_id: req.user.id,
        action: `Admin ${req.user.name} updated reminder ID: ${id}`
      });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    const reminder = await PreventiveReminder.findOne({ where: { id } });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Authorization: Only owner can delete (unless admin)
    if (req.user.role !== 'admin' && reminder.farmer_id !== farmer_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await reminder.destroy();

    if (req.user.role === 'admin') {
      await SystemLog.create({
        user_id: req.user.id,
        action: `Admin ${req.user.name} deleted reminder ID: ${id}`
      });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReminders = async (req, res) => {
    try {
        const reminders = await PreventiveReminder.findAll({
            include: [{ model: Animal, as: 'animal' }]
        });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
