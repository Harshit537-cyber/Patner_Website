import axios from "axios";

const api = axios.create({
  baseURL: "https://api.namahastro.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("partnerToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("partnerToken");
      localStorage.removeItem("partnerUser");
    }

    return Promise.reject(error);
  }
);

export default api;