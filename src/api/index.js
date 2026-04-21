import axios from 'axios';
import { getAccessToken, clearSession } from '../services/authService';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    const normalizedError = {
      message: error.response?.data?.message || error.message || 'Request failed',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };

    return Promise.reject(normalizedError);
  },
);

export { API_BASE_URL, apiClient };
