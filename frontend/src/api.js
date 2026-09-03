import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Добавь интерцептор для получения CSRF cookie
api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
    try {
      await axios.get(`${config.baseURL}/sanctum/csrf-cookie`, { 
        withCredentials: true 
      });
    } catch (error) {
      console.error('CSRF cookie error:', error);
    }
  }
  return config;
});

export default api;