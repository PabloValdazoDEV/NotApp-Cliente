import { useAtom } from 'jotai';
import { tokenAtom } from '../store/tokenAtom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export function useApi() {
  const [token] = useAtom(tokenAtom);

  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}
