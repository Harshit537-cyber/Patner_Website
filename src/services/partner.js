import { api } from "./api";

export const submitOnboardingStep = async (step, data) => {
  await new Promise((r) => setTimeout(r, 400));

  return {
    success: true,
    step,
    data,
  };
};

export const getApplicationStatus = async () => {
  await new Promise((r) => setTimeout(r, 400));

  return {
    status: "pending",
    submittedOn: new Date().toISOString(),
  };
};

export const getDutyStatus = async () => {
  return await api.get("/partner/duty-status");
};

export const setDutyOn = async () => {
  return await api.patch("/partner/duty-on", {});
};

export const setDutyOff = async () => {
  return await api.patch("/partner/duty-off", {});
};

export const uploadKyc = async ({
  selfie,
  nationalId,
  astrologyCertificate,
  addressProof,
}) => {
  const formData = new FormData();

  if (selfie) {
    formData.append("selfie", selfie);
  }

  if (nationalId) {
    formData.append("nationalId", nationalId);
  }

  if (astrologyCertificate) {
    formData.append(
      "astrologyCertificate",
      astrologyCertificate
    );
  }

  if (addressProof) {
    formData.append("addressProof", addressProof);
  }

  return await api.post(
    "/partner/kyc/upload",
    formData
  );
};

export const getKycStatus = async () => {
  return await api.get("/partner/kyc/status");
};

// ==========================================
// GET EXISTING BANK ACCOUNT
// ==========================================
export const getBankAccount = async () => {
  return await api.get("/partner/bank-account");
};

// ==========================================
// CREATE BANK ACCOUNT
// ==========================================
export const addBankAccount = async (data) => {
  return await api.post(
    "/partner/bank-account",
    data
  );
};

// ==========================================
// UPDATE BANK ACCOUNT - PUT
// ==========================================
export const updateBankAccount = async (data) => {
  return await api.put(
    "/partner/bank-account",
    data
  );
};
// ==========================================
// UPDATE MINIMUM RATE - PATCH
// ==========================================
export const updateMinRate = async (minRate) => {
  return await api.patch(
    "/partner/update-min-rate",
    { minRate }
  );
};
// ==========================================
// GET MINIMUM RATE
// ==========================================
export const getMinRate = async () => {
  return await api.get("/partner/min-rate");
};
// ==========================================
// GET PARTNER BOOKING REQUESTS
// ==========================================
export const getPartnerRequests = async () => {
  return await api.get("/bookings/partner/requests");
};
// ==========================================
// PARTNER SEND OTP
// ==========================================
export const sendPartnerOtp = async (mobile) => {
  return await api.post("/partner/send-otp", {
    mobile,
  });
};

// ==========================================
// PARTNER LOGIN SEND OTP
// ==========================================
export const sendPartnerLoginOtp = async (mobile) => {
  return await api.post("/partner/login-send-otp", {
    mobile,
  });
};

// ==========================================
// PARTNER RESPOND TO BOOKING
// ==========================================
export const respondToBooking = async (bookingId, action) => {
  return await api.post("/bookings/partner/respond", {
    bookingId,
    action,
  });
};

// ==========================================
// GET PARTNER REJECTED BOOKINGS
// ==========================================
export const getPartnerRejectedBookings = async () => {
  return await api.get("/bookings/partner/rejected");
};