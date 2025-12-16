import axiosInstance from '@/api/axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

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

// Làm mới token (cookie-based)
export const refreshToken = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN);
  return response.data;
};

// Google OAuth - Redirect to Google
export const initiateGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_AUTH}`;
};

// Verify Google OAuth callback
export const verifyGoogleAuth = async () => {
  // After OAuth callback, backend sets cookies and redirects to /oauth-success
  // This function is called from OAuthSuccessPage to get user data
  const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
  return response.data;
};
