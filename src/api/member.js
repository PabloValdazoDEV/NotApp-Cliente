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

  export const getPendingInvitations = async (homeId) => {
    try {
      const response = await api.get(`/member/invite/pending/${homeId}`);

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "No se han podido cargar las invitaciones pendientes",
      };
    }
  };

  export const cancelInvitation = async (invitationId) => {
    try {
      const response = await api.delete(`/member/invite/${invitationId}`);

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "No se ha podido cancelar la invitación",
      };
    }
  };

  export const deleteMember = async (data) => {

    try {
      const response = await api.delete(`/member/delete/${data}`);
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  export const updateMember = async (data) => {

    try {
      const response = await api.post(`/member/edit/${data.id}`, data);
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };
