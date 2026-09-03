import axios from 'axios';

// Функция для получения значения куки по имени
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(async (config) => {
  const method = config.method ? config.method.toLowerCase() : '';
  
  // Для всех изменяющих запросов получаем CSRF куку и добавляем её в заголовок
  if (['post', 'put', 'delete', 'patch'].includes(method)) {
    try {
      // 1. Запрашиваем установку куки
      await api.get('/sanctum/csrf-cookie');
      
      // 2. Читаем куку XSRF-TOKEN вручную
      const xsrfToken = getCookie('XSRF-TOKEN');
      
      // 3. Явно добавляем её в заголовок (это обходит блокировки браузера)
      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      }
    } catch (error) {
      console.error('Ошибка получения CSRF:', error);
    }
  }
  
  return config;
});

export default api;