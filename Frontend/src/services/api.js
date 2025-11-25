import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor to handle errors
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  getByRole: (role) => api.get(`/admin/users/role/${role}`),
  create: (data, labId) => api.post(`/admin/users${labId ? `?labId=${labId}` : ''}`, data),
  update: (id, data, labId) => api.put(`/admin/users/${id}${labId ? `?labId=${labId}` : ''}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

// Lab API
export const labAPI = {
  getAll: () => api.get('/labs'),
  getActive: () => api.get('/labs/active'),
  getById: (id) => api.get(`/labs/${id}`),
  getByManager: () => api.get('/lab-manager/labs'),
  create: (data) => api.post('/admin/labs', data),
  update: (id, data) => api.put(`/admin/labs/${id}`, data),
  delete: (id) => api.delete(`/admin/labs/${id}`),
};

// Equipment API
export const equipmentAPI = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  getByLab: (labId) => api.get(`/equipment/lab/${labId}`),
  getByStatus: (status) => api.get(`/equipment/status/${status}`),
  create: (data) => api.post('/lab-manager/equipment', data),
  update: (id, data) => api.put(`/lab-manager/equipment/${id}`, data),
  delete: (id) => api.delete(`/lab-manager/equipment/${id}`),
};

// Booking API
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getByUser: (userId) => api.get(`/bookings/user/${userId}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getByLab: (labId) => api.get(`/bookings/lab/${labId}`),
  getByDateRange: (labId, start, end) => api.get(`/bookings/lab/${labId}/availability`, { params: { start, end } }),
  createInstructor: (data) => api.post('/instructor/bookings', data),
  createStudent: (data) => api.post('/student/bookings', data),
  update: (id, data) => api.put(`/instructor/bookings/${id}`, data),
  approve: (id) => api.post(`/lab-manager/bookings/${id}/approve`),
  reject: (id) => api.post(`/lab-manager/bookings/${id}/reject`),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
  delete: (id) => api.delete(`/admin/bookings/${id}`),
};

// Maintenance API
export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByEquipment: (equipmentId) => api.get(`/maintenance/equipment/${equipmentId}`),
  getByStatus: (status) => api.get(`/maintenance/status/${status}`),
  getByTechnician: (technicianId) => api.get(`/maintenance/technician/${technicianId}`),
  create: (data) => api.post('/lab-manager/maintenance', data),
  update: (id, data) => api.put(`/lab-manager/maintenance/${id}`, data),
  assignTechnician: (id, technicianId) => api.post(`/lab-manager/maintenance/${id}/assign`, null, { params: { technicianId } }),
  complete: (id, cost, notes) => api.post(`/lab-manager/maintenance/${id}/complete`, null, { params: { cost, notes } }),
  cancel: (id) => api.post(`/lab-manager/maintenance/${id}/cancel`),
};

// Reports API
export const reportsAPI = {
  monthlyLabUsage: (yearMonth) => api.get('/admin/reports/monthly-lab-usage', { params: { yearMonth } }),
  equipmentUtilization: () => api.get('/admin/reports/equipment-utilization'),
  maintenanceStatistics: () => api.get('/admin/reports/maintenance-statistics'),
};

export default api;





