import axios from 'axios';
const api = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api' , // Use the environment variable or fallback to localhost
});

// Attach the JWT (if we have one) to every outgoing request automatically,
// so individual components never need to manage headers themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;