import api from "../api/config";


export const postItem = async (data) => {

    try {
      const response = await api.post(`/item/create-item`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

export const updateItem = async (data) => {

    try {
      const response = await api.post(`/item/${data.item_id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return response.data;
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  export const deleteItem = async (data) => {
  try {
    const response = await api.delete(`/item/${data}`);
    return response
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};