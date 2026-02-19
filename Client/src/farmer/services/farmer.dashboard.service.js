import api from "../../services/api";

export const getFarmerDashboardData = async () => {
  const response = await api.get("/farmer/dashboard");
  return response.data;
};

export const getFarmerRecentActivity = async () => {
  const response = await api.get("/farmer/dashboard/activity");
  return response.data;
};
