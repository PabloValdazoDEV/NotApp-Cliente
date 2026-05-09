export const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl;
  }
};
