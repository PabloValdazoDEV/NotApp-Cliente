import api from "./config";



export const updateInvitation = async (data) => {

    try {
      const response = await api.post(`/member/invite-check`, data);
  
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

  export const postInvite = async (data) => {

    try {
      const response = await api.post(`/member/invite/${data.id}`, data);
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

