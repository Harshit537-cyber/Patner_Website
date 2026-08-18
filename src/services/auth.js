// Mocked auth service. Replace body with `api.post(...)` calls once the backend is live.
export const sendOtp = async (phone) => {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, phone };
};

export const verifyOtp = async (phone, otp) => {
  await new Promise((r) => setTimeout(r, 500));
  if (otp.length !== 6) throw new Error('Invalid OTP');
  return { success: true, token: 'mock-token' };
};

export const registerPartner = async (payload) => {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, ...payload };
};

export const requestPasswordReset = async (email) => {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, email };
};
