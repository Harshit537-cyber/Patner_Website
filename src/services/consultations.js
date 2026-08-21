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

export const getPartnerAcceptedBookings = async () => {
  const response = await api.get("/bookings/partner/accepted");
  return response.data;
};

export const getPartnerRejectedBookings = async () => {
  const response = await api.get("/bookings/partner/rejected");
  return response.data;
};

export const respondToBookingRequest = async (bookingId, action) => {
  const response = await api.post("/bookings/partner/respond", {
    bookingId,
    action,
  });

  return response.data;
};