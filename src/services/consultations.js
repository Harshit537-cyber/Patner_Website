import api from "./api";

export const getRecentConsultations = async () => {
  const response = await api.get("/partner/recent-consultations");
  return response.data;
};

export const getPartnerBookingRequests = async () => {
  const response = await api.get("/bookings/partner/requests");
  return response.data;
};

export const getClientLogs = async () => {
  const response = await api.get("/bookings/client-logs");
  return response.data;
};