import api from "../api/config";

export const getAllHomesUser = async (data) => {
  try {
    const response = await api.get(`/home/user-home/${data}`);

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const postHome = async (data) => {
  try {
    const response = await api.post(`/home/create-home`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const getHome = async (data) => {
  try {
    const response = await api.get(`/home/${data}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const updateHome = async (data) => {
  try {
    const response = await api.post(`/home/${data.id}`, data,{
        headers: { "Content-Type": "multipart/form-data" },
      });
    return response
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const deleteHome = async (data) => {
  try {
    const response = await api.delete(`/home/${data}`);
    return response
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const addHomeFavorite = async (homeId) => {
  try {
    const response = await api.post(`/home/${homeId}/favorite`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al marcar el hogar como favorito",
    };
  }
};

export const removeHomeFavorite = async (homeId) => {
  try {
    const response = await api.delete(`/home/${homeId}/favorite`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al quitar el hogar de favoritos",
    };
  }
};
