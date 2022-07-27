import axios from "axios";


export const API_URL = "http://localhost:5005/api";
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem("token2")}`;
  return config;
});

api.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status == 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { withCredentials: true });
      localStorage.setItem("token2", response.data.accessToken);
      return api.request(originalRequest);
    } catch (e) {
      console.log("НЕ АВТОРИЗОВАН");
    }
  }
  throw error;
});

export default api;


