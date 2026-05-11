export const getPaginatedRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
};

export const getPaginationMeta = (data) => {
  return data?.pagination || data?.data?.pagination || {};
};
