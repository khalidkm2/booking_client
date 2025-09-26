import axios from 'axios';

const API_BASE = 'https://show-booking.onrender.com/api/v1';

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