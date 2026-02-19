import api from "./api";

export async function createAdminReminder(reminderData) {
  const response = await api.post("/reminders/admin", reminderData);
  return response.data;
}

export async function getAdminReminders() {
  const response = await api.get("/reminders/admin");
  return response.data;
}

export async function getFarmerReminders(farmerId) {
  const response = await api.get(`/reminders/farmer/${farmerId}`);
  return response.data;
}

export async function createFarmerReminder(reminderData) {
  const response = await api.post("/reminders/preventive", reminderData);
  return response.data;
}
