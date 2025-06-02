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
  try {
    const response = await api.post("/register", data);

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 30 });
    }
    console.log(response)
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
