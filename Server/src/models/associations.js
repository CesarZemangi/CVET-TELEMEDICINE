import User from './user.model.js';
import Case from './case.model.js';
import Consultation from './consultation.model.js';
import Message from './message.model.js';
import VideoSession from './videoSession.model.js';
import PreventiveReminder from './preventiveReminder.model.js';

// User Associations
User.hasMany(Case, { foreignKey: 'farmer_id' });
User.hasMany(Case, { foreignKey: 'vet_id' });

// Case Associations
Case.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Case.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });
Case.hasMany(Message, { foreignKey: 'case_id' });
Case.hasMany(VideoSession, { foreignKey: 'case_id' });

// Consultation Associations
Consultation.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });
Consultation.belongsTo(Case, { foreignKey: 'case_id' });

// Message Associations
Message.belongsTo(Case, { foreignKey: 'case_id' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

// VideoSession Associations
VideoSession.belongsTo(Case, { foreignKey: 'case_id' });
VideoSession.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
VideoSession.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });

// PreventiveReminder Associations
PreventiveReminder.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });

export { User, Case, Consultation, Message, VideoSession, PreventiveReminder };