import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // ✅ REMOVED auto redirect — let Redux handle it
    return Promise.reject(err);
  }
);

export default api;