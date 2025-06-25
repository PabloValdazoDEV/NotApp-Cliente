import api from "../api/config";



export const updateProfile = async (data) => {

    try {
      const response = await api.post(`/profile/${data.user_id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };
export const getProfile = async (data) => {

    try {
      const response = await api.get(`/profile/${data}`);
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };
