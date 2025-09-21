import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send/receive cookies
});

// Attach token from localStorage if present
axiosInstance.interceptors.request.use((config:any) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;