import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests — prioritize admin token on admin routes, user token otherwise
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith('/auth') || config.url?.startsWith('/applications') || config.url?.startsWith('/blog');
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  // Admin pages use adminToken, user pages use userToken
  if (adminToken && (isAdminRoute || !userToken)) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && !path.includes('/admin/login')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      } else if (path.startsWith('/dashboard')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
