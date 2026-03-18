import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const p = window.location.pathname;
      // ✅ Don't redirect if guest user is saved in localStorage
      const savedUser = localStorage.getItem('auth_user');
      const isGuest = savedUser && JSON.parse(savedUser)?.isGuest;
      if (!isGuest && p !== '/login' && p !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;