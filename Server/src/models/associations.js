import User from './user.model.js';
import Case from './case.model.js';
import Consultation from './consultation.model.js';
import Message from './message.model.js';
import Chatlog from './chatlog.model.js';
import VideoSession from './videoSession.model.js';
import PreventiveReminder from './preventiveReminder.model.js';
import Notification from './notification.model.js';
import Farmer from './farmer.model.js';
import Vet from './vet.model.js';

import Animal from './animal.model.js';

// User Associations
User.hasMany(Case, { foreignKey: 'farmer_id' });
User.hasMany(Case, { foreignKey: 'vet_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.hasOne(Farmer, { foreignKey: 'user_id' });
User.hasOne(Vet, { foreignKey: 'user_id' });

// Farmer & Vet Associations back to User
Farmer.belongsTo(User, { foreignKey: 'user_id' });
Vet.belongsTo(User, { foreignKey: 'user_id' });

// Animal Associations
Animal.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Animal.hasMany(PreventiveReminder, { foreignKey: 'animal_id' });

// Case Associations
Case.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Case.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });
Case.hasMany(Message, { foreignKey: 'case_id' });
Case.hasMany(Chatlog, { foreignKey: 'case_id' });
Case.hasMany(VideoSession, { foreignKey: 'case_id' });

// Consultation Associations
Consultation.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });
Consultation.belongsTo(Case, { foreignKey: 'case_id' });

// Message Associations
Message.belongsTo(Case, { foreignKey: 'case_id' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

// Chatlog Associations
Chatlog.belongsTo(Case, { foreignKey: 'case_id' });
Chatlog.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Chatlog.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

// VideoSession Associations
VideoSession.belongsTo(Case, { foreignKey: 'case_id' });
VideoSession.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
VideoSession.belongsTo(User, { as: 'vet', foreignKey: 'vet_id' });

// PreventiveReminder Associations
PreventiveReminder.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
PreventiveReminder.belongsTo(Animal, { as: 'animal', foreignKey: 'animal_id' });

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'user_id' });

export { User, Case, Consultation, Message, Chatlog, VideoSession, PreventiveReminder, Notification, Farmer, Vet, Animal };
