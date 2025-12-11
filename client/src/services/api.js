import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const metricsAPI = {
  getMetrics: (hours = 1) => api.get(`/metrics?hours=${hours}`),
  getLatest: () => api.get('/metrics/latest'),
  getStats: (type, hours = 24) => api.get(`/metrics/stats?type=${type}&hours=${hours}`),
  createMetric: (data) => api.post('/metrics', data),
};

export const alertsAPI = {
  getAlerts: (limit = 50) => api.get(`/alerts?limit=${limit}`),
  getStats: (hours = 24) => api.get(`/alerts/stats?hours=${hours}`),
};

export const endpointsAPI = {
  getEndpoints: () => api.get('/endpoints'),
  createEndpoint: (data) => api.post('/endpoints', data),
  deleteEndpoint: (id) => api.delete(`/endpoints/${id}`),
  toggleEndpoint: (id) => api.patch(`/endpoints/${id}/toggle`),
};

export default api;
