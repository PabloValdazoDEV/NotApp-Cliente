import api from "../api/config";
import Cookies from "js-cookie";

export const tryLogin = async (data) => {

  try {
    const response = await api.post("/login", data);

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 30 });
    }

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const tryRegister = async (data) => {
  const register = import.meta.env.VITE_REGISTER
  try {
    const response = await api.post(register, data);

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 30 });
    }
    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const tryLogout = async () => {
  Cookies.remove("token");
};

export const tryMe = async (token) => {
  try {
    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Usuario desde /me:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en /me:", error.response?.data || error.message);
    return null;
  }
};

export const tryForgotPassword = async (data) => {
  console.log(data)
  try {
    const response = await api.post("/forgot-password", data);

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};


export const tryResetPassword = async ({data, token}) => {
  try {
    const response = await api.post(`/reset-password/${token}`, data);

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const tryCheckToken = async ( token) => {
  try {
    const response = await api.get(`/check-token/${token}`);

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};