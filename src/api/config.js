import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT_MESSAGE =
  "La conexión está tardando demasiado. Inténtalo de nuevo.";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout");
    const userMessage = isTimeout
      ? TIMEOUT_MESSAGE
      : error.response?.data?.message || "No se pudo completar la acción.";

    error.userMessage = userMessage;
    error.isTimeout = isTimeout;

    if (!error.response) {
      error.response = { data: { message: userMessage } };
    } else if (!error.response.data?.message) {
      error.response.data = {
        ...(error.response.data || {}),
        message: userMessage,
      };
    }

    if (isTimeout) {
      toast.error(userMessage, { id: "api-timeout" });
    }

    return Promise.reject(error);
  }
);

export default api;
