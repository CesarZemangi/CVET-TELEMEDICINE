import SystemLog from '../models/systemLog.model.js';

export const logAction = async (userId, action, options = {}) => {
  try {
    const { 
      actionType = 'info', 
      module = 'general', 
      entityId = null, 
      oldValue = null, 
      newValue = null,
      ipAddress = null
    } = options;

    await SystemLog.create({
      user_id: userId || null,
      action,
      action_type: actionType,
      module,
      entity_id: entityId,
      old_value: oldValue,
      new_value: newValue,
      ip_address: ipAddress,
      created_by: userId || null
    });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};

export default logAction;
