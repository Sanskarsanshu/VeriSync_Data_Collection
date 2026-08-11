import axios from 'axios';

// The NestJS backend is running on 3001
export const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // This ensures the HttpOnly verisync_session cookie is sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
