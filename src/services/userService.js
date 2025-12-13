import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * User Service
 * Xử lý các API liên quan đến user
 */

// Lấy thông tin profile hiện tại
export const getProfile = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
  return response.data;
};

// Cập nhật profile
export const updateProfile = async (data) => {
  const response = await axiosInstance.put(API_ENDPOINTS.PROFILE, data);
  return response.data;
};

// Đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  const response = await axiosInstance.put(API_ENDPOINTS.CHANGE_PASSWORD, {
    oldPassword,
    newPassword,
  });
  return response.data;
};

// Tìm kiếm user
export const searchUsers = async (query) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SEARCH_USERS, {
    params: { q: query },
  });
  return response.data;
};

// Lấy thông tin user theo ID
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.USER_BY_ID(userId));
  return response.data;
};

