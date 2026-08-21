import api from "./api";

export const getDutyStatus = async () => {
  const response = await api.get("/partner/duty-status");
  return response;
};

export const setDutyOn = async () => {
  const response = await api.patch("/partner/duty-on", {});
  return response;
};

export const setDutyOff = async () => {
  const response = await api.patch("/partner/duty-off", {});
  return response;
};

export const uploadKyc = async ({
  selfie,
  nationalId,
  astrologyCertificate,
  addressProof,
}) => {
  const formData = new FormData();

  if (selfie) formData.append("selfie", selfie);
  if (nationalId) formData.append("nationalId", nationalId);
  if (astrologyCertificate) {
    formData.append("astrologyCertificate", astrologyCertificate);
  }
  if (addressProof) formData.append("addressProof", addressProof);

  const response = await api.post("/partner/kyc/upload", formData);
  return response;
};

export const getKycStatus = async () => {
  const response = await api.get("/partner/kyc/status");
  return response;
};

export const getBankAccount = async () => {
  const response = await api.get("/partner/bank-account");
  return response;
};

export const addBankAccount = async (data) => {
  const response = await api.post("/partner/bank-account", data);
  return response;
};

export const updateBankAccount = async (data) => {
  const response = await api.put("/partner/bank-account", data);
  return response;
};

export const updateMinRate = async (minRate) => {
  const response = await api.patch("/partner/update-min-rate", {
    minRate,
  });
  return response;
};

export const getMinRate = async () => {
  const response = await api.get("/partner/min-rate");
  return response;
};

export const getPartnerRequests = async () => {
  const response = await api.get("/bookings/partner/requests");
  return response;
};

export const respondToBooking = async (bookingId, action) => {
  const response = await api.post("/bookings/partner/respond", {
    bookingId,
    action,
  });
  return response;
};

export const getPartnerRejectedBookings = async () => {
  const response = await api.get("/bookings/partner/rejected");
  return response;
};

export const sendPartnerOtp = async (mobile) => {
  const response = await api.post("/partner/send-otp", {
    mobile,
  });
  return response;
};

export const sendPartnerLoginOtp = async (mobile) => {
  const response = await api.post("/partner/login-send-otp", {
    mobile,
  });
  return response;
};

export const createTicket = async (data) => {
  const response = await api.post("/tickets/create", data);
  return response;
};

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my-tickets");
  return response;
};

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response;
};