import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tables API
export const tablesAPI = {
  getAll: () => api.get('/tables'),
  update: (tableNumber, data) => api.put(`/tables/${tableNumber}`, data),
};

// Menu API
export const menuAPI = {
  getAll: (category) => api.get('/menu', { params: { category } }),
  getCategories: () => api.get('/menu/categories'),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Reports API
export const reportsAPI = {
  getDailyReport: (date) => api.get('/reports/daily', { params: { date } }),
  getRangeReport: (startDate, endDate) =>
    api.get('/reports/range', { params: { start_date: startDate, end_date: endDate } }),
};

export default api;
