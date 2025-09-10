import api from "./config";

export const getListHome = async (id_home) => {
  try {
    const response = await api.get(`/list/home/${id_home}`);
    return response
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const postList = async (data) => {
  try {
    const response = await api.post("/list/create-list", data);
    return response
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const filterParamsList = async (params) => {
  try {
    const response = await api.get(`/list/params/${params.id_home}`, {params});
    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};