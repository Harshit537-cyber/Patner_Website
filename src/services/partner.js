import api from "./api";

export const getDutyStatus = async () => {
  const response = await api.get("/partner/duty-status");
  return response.data;
};

export const setDutyOn = async () => {
  const response = await api.patch("/partner/duty-on");
  return response.data;
};

export const setDutyOff = async () => {
  const response = await api.patch("/partner/duty-off");
  return response.data;
};

export const uploadKyc = async (files) => {
  const formData = new FormData();

  Object.entries(files).forEach(([key, file]) => {
    if (file) {
      formData.append(key, file);
    }
  });

  const response = await api.post("/partner/kyc/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000,
  });

  return response.data;
};

export const getKycStatus = async (retries = 3) => {
  try {
    const response = await api.get("/partner/kyc/status");
    return response.data;
  } catch (error) {
    if (
      retries > 0 &&
      (error.message === "Network Error" ||
        error.code === "ECONNABORTED")
    ) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return getKycStatus(retries - 1);
    }

    throw error;
  }
};

export const getBankAccount = async () => {
  const response = await api.get("/partner/bank-account");
  return response.data;
};

export const addBankAccount = async (data) => {
  const response = await api.post("/partner/bank-account", data);
  return response.data;
};

export const updateBankAccount = async (data) => {
  const response = await api.put("/partner/bank-account", data);
  return response.data;
};

export const updateMinRate = async (minRate) => {
  const response = await api.patch("/partner/update-min-rate", {
    minRate,
  });

  return response.data;
};

export const getMinRate = async () => {
  const response = await api.get("/partner/min-rate");
  return response.data;
};

export const getPartnerRequests = async () => {
  const response = await api.get("/bookings/partner/requests");
  return response.data;
};

export const respondToBooking = async (bookingId, action) => {
  const response = await api.post("/bookings/partner/respond", {
    bookingId,
    action,
  });

  return response.data;
};

export const getPartnerRejectedBookings = async () => {
  const response = await api.get("/bookings/partner/rejected");
  return response.data;
};

export const sendPartnerOtp = async (mobile) => {
  const response = await api.post("/partner/send-otp", {
    mobile,
  });

  return response.data;
};

export const sendPartnerLoginOtp = async (mobile) => {
  const response = await api.post("/partner/login-send-otp", {
    mobile,
  });

  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post("/tickets/create", data);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my-tickets");
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};