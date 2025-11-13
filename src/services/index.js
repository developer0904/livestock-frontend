import api from './api';

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
  getCurrentUser: () => api.get('/auth/user/'),
  changePassword: (data) => api.post('/auth/change-password/', data),
  
  // Profile API
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/update/', data),
  updateProfileWithImage: (formData) => api.patch('/auth/profile/update/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Animals API
export const animalsAPI = {
  getAll: (params) => api.get('/animals/', { params }),
  getById: (id) => api.get(`/animals/${id}/`),
  create: (data) => api.post('/animals/', data),
  update: (id, data) => api.put(`/animals/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/animals/${id}/`, data),
  delete: (id) => api.delete(`/animals/${id}/`),
};

// Owners API
export const ownersAPI = {
  getAll: (params) => api.get('/owners/', { params }),
  getById: (id) => api.get(`/owners/${id}/`),
  create: (data) => api.post('/owners/', data),
  update: (id, data) => api.put(`/owners/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/owners/${id}/`, data),
  delete: (id) => api.delete(`/owners/${id}/`),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events/', { params }),
  getById: (id) => api.get(`/events/${id}/`),
  create: (data) => api.post('/events/', data),
  update: (id, data) => api.put(`/events/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/events/${id}/`, data),
  delete: (id) => api.delete(`/events/${id}/`),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory/', { params }),
  getById: (id) => api.get(`/inventory/${id}/`),
  create: (data) => api.post('/inventory/', data),
  update: (id, data) => api.put(`/inventory/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/inventory/${id}/`, data),
  delete: (id) => api.delete(`/inventory/${id}/`),
};

// Reports API
export const reportsAPI = {
  getAll: (params) => api.get('/reports/', { params }),
  getById: (id) => api.get(`/reports/${id}/`),
  create: (data) => api.post('/reports/', data),
  update: (id, data) => api.put(`/reports/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/reports/${id}/`, data),
  delete: (id) => api.delete(`/reports/${id}/`),
};

// Profile API (alias for convenience)
export const profileAPI = {
  get: () => authAPI.getProfile(),
  update: (data) => authAPI.updateProfile(data),
  updateWithImage: (formData) => authAPI.updateProfileWithImage(formData),
};

export default {
  auth: authAPI,
  profile: profileAPI,
  animals: animalsAPI,
  owners: ownersAPI,
  events: eventsAPI,
  inventory: inventoryAPI,
  reports: reportsAPI,
};
