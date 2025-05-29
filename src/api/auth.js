import api from "../api/config";


export const tryRegister = async (data) => {
    try {
      const response = await api.post("/register", data);
      console.log(response)
    } catch (error) {
      console.error(
        "Error en el registro:",
        error.response?.data || error.message
      );
    }
  };


export const tryLogout = async () => {
  try {
    await supabase.auth.signOut();
    Cookies.remove("token");
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};
