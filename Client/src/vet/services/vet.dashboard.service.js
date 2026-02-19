import api from "../../services/api";

export const getVetDashboardData = async () => {
  const response = await api.get("/vet/dashboard");
  return response.data;
};

export const getVetRecentActivity = async () => {
  const response = await api.get("/vet/dashboard/activity");
  return response.data;
};
