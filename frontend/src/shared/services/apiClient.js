import axios from 'axios';
import { clearAuthSession, getAuthToken } from '../utils/authSession';

const DEFAULT_API_URL = 'http://localhost:3000';

export const apiBaseUrl = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '');

const isAuthRequest = (url = '') => (
  typeof url === 'string' && url.startsWith('/login')
);

const redirectToLogin = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.location.assign('/');
  }
};

const apiClient = axios.create({
  baseURL: apiBaseUrl
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && !isAuthRequest(requestUrl)) {
      clearAuthSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
