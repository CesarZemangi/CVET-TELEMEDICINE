import User from './user.model.js';
import Case from './case.model.js';
import CaseMedia from './caseMedia.model.js';
import Consultation from './consultation.model.js';
import Message from './message.model.js';
import VideoSession from './videoSession.model.js';
import PreventiveReminder from './preventiveReminder.model.js';
import Notification from './notification.model.js';
import Farmer from './farmer.model.js';
import Vet from './vet.model.js';
import Feedback from './feedback.model.js';
import FeedInventory from './feedInventory.model.js';
import MedicationHistory from './medicationHistory.model.js';
import Appointment from './appointment.model.js';

import Animal from './animal.model.js';
import Prescription from './prescription.model.js';
import TreatmentPlan from './treatmentPlan.model.js';
import LabRequest from './labRequest.model.js';
import LabResult from './labResult.model.js';
import Reminder from './reminder.model.js';
import AiPredictionLog from './aiPredictionLog.model.js';
import Payment from './payment.model.js';

// User Associations
User.hasMany(Case, { foreignKey: 'farmer_id', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'receiver_id', onDelete: 'CASCADE' });
User.hasOne(Farmer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Vet, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Reminder, { foreignKey: 'created_by', onDelete: 'SET NULL' });

// Farmer & Vet Associations back to User
Farmer.belongsTo(User, { foreignKey: 'user_id' });
Vet.belongsTo(User, { foreignKey: 'user_id' });
Vet.hasMany(Case, { foreignKey: 'vet_id', onDelete: 'RESTRICT' });

// Animal Associations
Animal.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Animal.hasMany(PreventiveReminder, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
Animal.hasMany(MedicationHistory, { foreignKey: 'animal_id', onDelete: 'CASCADE' });

// Case Associations
Case.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Case.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Case.belongsTo(Animal, { foreignKey: 'animal_id' });
Case.hasMany(Message, { foreignKey: 'case_id', onDelete: 'CASCADE' });
Case.hasMany(VideoSession, { foreignKey: 'case_id', onDelete: 'CASCADE' });
Case.hasMany(LabRequest, { foreignKey: 'case_id', onDelete: 'CASCADE' });
Case.hasMany(TreatmentPlan, { foreignKey: 'case_id', onDelete: 'CASCADE' });
Case.hasMany(Prescription, { foreignKey: 'case_id', onDelete: 'CASCADE' });
Case.hasMany(CaseMedia, { foreignKey: 'case_id', onDelete: 'CASCADE' });
CaseMedia.belongsTo(Case, { foreignKey: 'case_id' });
CaseMedia.belongsTo(User, { as: 'uploader', foreignKey: 'uploaded_by' });
CaseMedia.belongsTo(User, { as: 'updater', foreignKey: 'updated_by' });

// Consultation Associations
Consultation.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Consultation.belongsTo(Case, { foreignKey: 'case_id' });

// Lab Associations
LabRequest.belongsTo(Case, { foreignKey: 'case_id' });
LabRequest.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
LabRequest.hasOne(LabResult, { foreignKey: 'lab_request_id', onDelete: 'CASCADE' });
LabResult.belongsTo(LabRequest, { foreignKey: 'lab_request_id' });

// Treatment Associations
Prescription.belongsTo(Case, { foreignKey: 'case_id' });
Prescription.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
TreatmentPlan.belongsTo(Case, { foreignKey: 'case_id' });
TreatmentPlan.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Case.hasMany(MedicationHistory, { foreignKey: 'case_id', onDelete: 'CASCADE' });

// Feedback Associations
Feedback.belongsTo(Case, { foreignKey: 'case_id' });
Feedback.belongsTo(Consultation, { foreignKey: 'consultation_id' });
Feedback.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Feedback.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });

// Medication History Associations
MedicationHistory.belongsTo(Animal, { foreignKey: 'animal_id' });
MedicationHistory.belongsTo(Case, { foreignKey: 'case_id' });
MedicationHistory.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });

// Feed Inventory Associations
// Feed inventory rows point to farmers table (farmer_id).
FeedInventory.belongsTo(Farmer, { as: 'farmer', foreignKey: 'farmer_id' });

// Reminder Associations
Reminder.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

// Message Associations
Message.belongsTo(Case, { foreignKey: 'case_id' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

// VideoSession Associations
VideoSession.belongsTo(Case, { foreignKey: 'case_id' });
VideoSession.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
VideoSession.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });

// PreventiveReminder Associations
PreventiveReminder.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
PreventiveReminder.belongsTo(Animal, { as: 'animal', foreignKey: 'animal_id' });

// Notification Associations
Notification.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });
Notification.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Notification.belongsTo(Message, { as: 'Message', foreignKey: 'reference_id' });
Notification.belongsTo(Case, { as: 'Case', foreignKey: 'reference_id' });

// Appointment Associations
Appointment.belongsTo(Case, { foreignKey: 'case_id' });
Appointment.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Appointment.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Case.hasMany(Appointment, { foreignKey: 'case_id', onDelete: 'CASCADE' });

// AI Prediction Logs
Case.hasMany(AiPredictionLog, { foreignKey: 'case_id', onDelete: 'SET NULL' });
AiPredictionLog.belongsTo(Case, { foreignKey: 'case_id' });
Vet.hasMany(AiPredictionLog, { foreignKey: 'vet_id', onDelete: 'CASCADE' });
AiPredictionLog.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
User.hasMany(AiPredictionLog, { foreignKey: 'farmer_id', onDelete: 'SET NULL' });
AiPredictionLog.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });

// Payment Associations
Payment.belongsTo(User, { as: 'farmer', foreignKey: 'farmer_id' });
Payment.belongsTo(Vet, { as: 'vet', foreignKey: 'vet_id' });
Payment.belongsTo(User, { as: 'verifier', foreignKey: 'verified_by' });
Payment.belongsTo(Appointment, { as: 'appointment', foreignKey: 'appointment_id' });
Appointment.hasOne(Payment, { foreignKey: 'appointment_id', onDelete: 'CASCADE' });

export { 
  User, Case, CaseMedia, Consultation, Message, VideoSession, 
  PreventiveReminder, Notification, Farmer, Vet, Animal, 
  Prescription, TreatmentPlan, LabRequest, LabResult,
  Feedback, FeedInventory, MedicationHistory, Reminder, Appointment, AiPredictionLog,
  Payment
};
