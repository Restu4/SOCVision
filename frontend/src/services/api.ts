import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { fullname: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
};

export const logsApi = {
  getAll: (params?: any) => api.get('/logs', { params }),
  getStats: () => api.get('/logs/stats'),
};

export const alertsApi = {
  getAll: (params?: any) => api.get('/alerts', { params }),
  getOne: (id: number) => api.get(`/alerts/${id}`),
  update: (id: number, data: any) => api.patch(`/alerts/${id}`, data),
};

export const incidentsApi = {
  getAll: () => api.get('/incidents'),
  getOne: (id: number) => api.get(`/incidents/${id}`),
  update: (id: number, data: any) => api.patch(`/incidents/${id}`, data),
};

export const threatIntelApi = {
  getAll: () => api.get('/threat-intelligence'),
  getOne: (id: number) => api.get(`/threat-intelligence/${id}`),
  create: (data: any) => api.post('/threat-intelligence', data),
  remove: (id: number) => api.delete(`/threat-intelligence/${id}`),
};

export const rulesApi = {
  getAll: () => api.get('/rules'),
  getOne: (id: number) => api.get(`/rules/${id}`),
  create: (data: any) => api.post('/rules', data),
  update: (id: number, data: any) => api.patch(`/rules/${id}`, data),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
};

export default api;
