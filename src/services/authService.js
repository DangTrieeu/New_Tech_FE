import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Authentication Service
 * Xử lý các API liên quan đến xác thực
 */

// Đăng nhập
export const login = async (email, password) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
    email,
    password,
  });
  return response.data;
};

// Đăng ký
export const register = async (name, email, password) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
    name,
    email,
    password,
  });
  return response.data;
};

// Đăng xuất
export const logout = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  return response.data;
};

// Làm mới token
export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
    refreshToken,
  });
  return response.data;
};

