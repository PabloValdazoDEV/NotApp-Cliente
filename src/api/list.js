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

export const updateList = async (data) => {
  try {
    const response = await api.post(`/list/update-list/${data.list_id}`, {
      title: data.title,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar la lista",
    };
  }
};

export const deleteList = async (list_id) => {
  try {
    const response = await api.delete(`/list/delete-list/${list_id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al eliminar la lista",
    };
  }
};

export const addItemToList = async (data) => {
  try {
    const response = await api.post(`/list/add-item/${data.list_id}`, {
      id_item: data.item_id,
      quantity: data.quantity,
      clientMutationId: data.clientMutationId,
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al añadir el producto" };
  }
};

export const updateItemList = async (data) => {
  try {
    const body = {};

    if (data.quantity !== undefined) body.quantity = data.quantity;
    if (data.check_take !== undefined) body.check_take = data.check_take;
    if (data.status !== undefined) body.status = data.status;
    if (data.clientMutationId) body.clientMutationId = data.clientMutationId;

    const response = await api.post(`/list/update-itemlist/${data.item_list_id}`, body);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al actualizar el producto" };
  }
};

export const createListFromNotFound = async (data) => {
  try {
    const response = await api.post(`/list/create-from-not-found/${data.list_id}`, {
      title: data.title,
      clientMutationId: data.clientMutationId,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al crear la lista con productos no encontrados",
    };
  }
};

export const deleteItemList = async (data) => {
  const itemListId = typeof data === "string" ? data : data.item_list_id;
  const body = typeof data === "string" ? undefined : { clientMutationId: data.clientMutationId };

  try {
    const response = await api.delete(`/list/delete-itemlist/${itemListId}`, {
      data: body,
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al eliminar el producto" };
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

export const getList = async (params) => {
  try {
    const response = await api.get(`/list/${params.hogar_id}/${params.list_id}`);
    return response.data
  } catch (error) {
     return { success: false, message: error.response.data.message };
  }
}

export const getAllItemList = async (params) => {
  try {
    const response = await api.get(`/list/params/items/${params.id_list}`, {params});
    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};
