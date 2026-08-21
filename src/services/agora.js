import api from "./api";

export const startAgoraSession = async (data) => {
  const response = await api.post("/agora/start", data);
  return response.data;
};

export const getAgoraViewerCount = async (id) => {
  const response = await api.get(`/agora/viewer-count/${id}`);
  return response.data;
};

export const endAgoraSession = async (data = {}) => {
  const response = await api.post("/agora/end", data);
  return response.data;
};