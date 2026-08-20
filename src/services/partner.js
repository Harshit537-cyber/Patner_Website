import  api  from "./api";

// ===============================
// ONBOARDING
// ===============================

export const submitOnboardingStep = async (step, data) => {
  return {
    success: true,
    step,
    data,
  };
};

export const getApplicationStatus = async () => {
  return {
    status: "pending",
    submittedOn: new Date().toISOString(),
  };
};

// ===============================
// DUTY STATUS
// ===============================

export const getDutyStatus = async () => {
  try {
    const response = await api.get("/partner/duty-status");
    console.log("✅ Duty Status:", response);
    return response;
  } catch (error) {
    console.error("❌ Duty Status Error:", error);
    throw error;
  }
};

export const setDutyOn = async () => {
  try {
    const response = await api.patch("/partner/duty-on", {});
    console.log("✅ Duty ON:", response);
    return response;
  } catch (error) {
    console.error("❌ Duty ON Error:", error);
    throw error;
  }
};

export const setDutyOff = async () => {
  try {
    const response = await api.patch("/partner/duty-off", {});
    console.log("✅ Duty OFF:", response);
    return response;
  } catch (error) {
    console.error("❌ Duty OFF Error:", error);
    throw error;
  }
};

// ===============================
// KYC
// ===============================

export const uploadKyc = async ({
  selfie,
  nationalId,
  astrologyCertificate,
  addressProof,
}) => {
  try {
    const formData = new FormData();

    if (selfie) {
      formData.append("selfie", selfie);
    }

    if (nationalId) {
      formData.append("nationalId", nationalId);
    }

    if (astrologyCertificate) {
      formData.append("astrologyCertificate", astrologyCertificate);
    }

    if (addressProof) {
      formData.append("addressProof", addressProof);
    }

    const response = await api.post("/partner/kyc/upload", formData);

    console.log("✅ KYC Upload Response:", response);

    return response;
  } catch (error) {
    console.error("❌ KYC Upload Error:", error);
    throw error;
  }
};

export const getKycStatus = async () => {
  try {
    const response = await api.get("/partner/kyc/status");

    console.log("✅ KYC Status:", response);

    return response;
  } catch (error) {
    console.error("❌ KYC Status Error:", error);
    throw error;
  }
};

// ===============================
// BANK ACCOUNT
// ===============================

export const getBankAccount = async () => {
  try {
    const response = await api.get("/partner/bank-account");

    console.log("✅ Bank Account:", response);

    return response;
  } catch (error) {
    console.error("❌ Get Bank Account Error:", error);
    throw error;
  }
};

export const addBankAccount = async (data) => {
  try {
    const response = await api.post("/partner/bank-account", data);

    console.log("✅ Bank Account Added:", response);

    return response;
  } catch (error) {
    console.error("❌ Add Bank Account Error:", error);
    throw error;
  }
};

export const updateBankAccount = async (data) => {
  try {
    const response = await api.put("/partner/bank-account", data);

    console.log("✅ Bank Account Updated:", response);

    return response;
  } catch (error) {
    console.error("❌ Update Bank Account Error:", error);
    throw error;
  }
};

// ===============================
// MINIMUM RATE
// ===============================

export const updateMinRate = async (minRate) => {
  try {
    const response = await api.patch("/partner/update-min-rate", {
      minRate,
    });

    console.log("✅ Min Rate Updated:", response);

    return response;
  } catch (error) {
    console.error("❌ Update Min Rate Error:", error);
    throw error;
  }
};

export const getMinRate = async () => {
  try {
    const response = await api.get("/partner/min-rate");

    console.log("✅ Min Rate:", response);

    return response;
  } catch (error) {
    console.error("❌ Get Min Rate Error:", error);
    throw error;
  }
};

// ===============================
// BOOKING / CONSULTATION
// ===============================

export const getPartnerRequests = async () => {
  try {
    const response = await api.get("/bookings/partner/requests");

    console.log("=================================");
    console.log("📋 PARTNER BOOKING REQUESTS");
    console.log("=================================");
    console.log("API Response:", response);
    console.log("Response Data:", response?.data);
    console.log("=================================");

    return response;
  } catch (error) {
    console.error("❌ Partner Booking Requests Error:", error);
    console.error("Error Response:", error?.response);
    throw error;
  }
};

export const respondToBooking = async (bookingId, action) => {
  try {
    const response = await api.post("/bookings/partner/respond", {
      bookingId,
      action,
    });

    console.log("✅ Booking Response:", response);

    return response;
  } catch (error) {
    console.error("❌ Booking Respond Error:", error);
    throw error;
  }
};

export const getPartnerRejectedBookings = async () => {
  try {
    const response = await api.get("/bookings/partner/rejected");

    console.log("✅ Rejected Bookings:", response);

    return response;
  } catch (error) {
    console.error("❌ Rejected Bookings Error:", error);
    throw error;
  }
};

// ===============================
// PARTNER OTP
// ===============================

export const sendPartnerOtp = async (mobile) => {
  try {
    const response = await api.post("/partner/send-otp", {
      mobile,
    });

    console.log("✅ Partner OTP Sent:", response);

    return response;
  } catch (error) {
    console.error("❌ Partner OTP Error:", error);
    throw error;
  }
};

export const sendPartnerLoginOtp = async (mobile) => {
  try {
    const response = await api.post("/partner/login-send-otp", {
      mobile,
    });

    console.log("✅ Partner Login OTP Sent:", response);

    return response;
  } catch (error) {
    console.error("❌ Partner Login OTP Error:", error);
    throw error;
  }
};

// ===============================
// SUPPORT TICKETS
// ===============================

export const createTicket = async (data) => {
  try {
    const response = await api.post("/tickets/create", data);

    console.log("✅ Ticket Created:", response);

    return response;
  } catch (error) {
    console.error("❌ Create Ticket Error:", error);
    throw error;
  }
};

export const getMyTickets = async () => {
  try {
    const response = await api.get("/tickets/my-tickets");

    console.log("✅ My Tickets:", response);

    return response;
  } catch (error) {
    console.error("❌ Get Tickets Error:", error);
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`);

    console.log("✅ Ticket Details:", response);

    return response;
  } catch (error) {
    console.error("❌ Ticket Details Error:", error);
    throw error;
  }
};