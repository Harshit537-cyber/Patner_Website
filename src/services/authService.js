import api from "./api"

export const verifyOtp = (data) => {
  return api.post("/partner/verify-otp", data);
};

export const registerPartner = (data) => {
  return api.post("/partner/register", data);
};


export const getPartnerById= (id)=>{
  return api.get(`/partner/astrologerById/${id}`)
}