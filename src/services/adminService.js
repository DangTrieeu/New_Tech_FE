import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

// Axios instance for Admin APIs
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add admin token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Admin Auth ====================
export const adminLogin = async (email, password) => {
  const response = await adminApi.post('/admin/login', { email, password });
  return response.data;
};

// ==================== User Management ====================
export const getAllUsers = async () => {
  const response = await adminApi.get('/admin/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await adminApi.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await adminApi.patch(`/admin/users/${id}/status`, { status });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await adminApi.delete(`/admin/users/${id}`);
  return response.data;
};

// ==================== Room Management ====================
export const getAllRooms = async () => {
  const response = await adminApi.get('/admin/rooms');
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await adminApi.get(`/admin/rooms/${id}`);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await adminApi.delete(`/admin/rooms/${id}`);
  return response.data;
};

// ==================== Dashboard Metrics ====================
export const getMetricsOverview = async () => {
  const response = await adminApi.get('/admin/metrics/overview');
  return response.data;
};

export const getMessagesByDate = async (days = 7) => {
  const response = await adminApi.get(`/admin/metrics/messages-by-date?days=${days}`);
  return response.data;
};
