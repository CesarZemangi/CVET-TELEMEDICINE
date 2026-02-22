import SystemLog from '../models/systemLog.model.js';

export const logAction = async (userId, action, module = 'general', referenceId = null) => {
  try {
    await SystemLog.create({
      user_id: userId || null,
      action,
      created_by: userId || null
    });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};

export default logAction;
