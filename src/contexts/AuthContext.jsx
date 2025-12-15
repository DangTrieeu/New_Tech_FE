import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '@/services/authService';
import * as userService from '@/services/userService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false); // Track if checkAuth đã chạy
  const navigate = useNavigate();

  // Kiểm tra token khi app khởi động - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    if (!initialized) {
      checkAuth();
    }
  }, [initialized]);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      // Lấy thông tin user từ API
      const response = await userService.getProfile();
      setUser(response.data || response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Đăng nhập (support cả USER và ADMIN)
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      console.log('AuthContext - Full response:', response);

      // authService.login return response.data = { status: 200, message: "...", data: {...} }
      // Nên response = { status: 200, message: "...", data: {...} }
      const payload = response.data;

      console.log('AuthContext - payload:', payload);

      // Kiểm tra response có đúng format không
      if (!payload || !payload.accessToken || !payload.refreshToken) {
        console.error('Invalid response structure:', { response, payload });
        throw new Error('Response không có accessToken hoặc refreshToken');
      }

      // Update states
      const userData = payload.user;

      if (!userData) {
        throw new Error('Response không có thông tin user');
      }

      const isAdmin = userData.role === 'ADMIN';

      // Lưu tokens dựa trên role
      if (isAdmin) {
        localStorage.setItem('adminAccessToken', payload.accessToken);
        localStorage.setItem('adminRefreshToken', payload.refreshToken);
      } else {
        localStorage.setItem('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      }

      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);

      toast.success('Đăng nhập thành công!');

      return { userData, isAdmin: userData.role === 'ADMIN' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      toast.error(message);
      throw error;
    }
  };

  // Đăng ký
  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(message);
      throw error;
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa tokens và user state
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Đã đăng xuất');
      navigate('/login');
    }
  };

  // Cập nhật profile
  const updateUserProfile = async (data) => {
    try {
      const response = await userService.updateProfile(data);
      setUser(response.user || response.data);
      toast.success('Cập nhật thông tin thành công!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật thất bại';
      toast.error(message);
      throw error;
    }
  };

  // Đổi mật khẩu
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await userService.changePassword(oldPassword, newPassword);
      toast.success('Đổi mật khẩu thành công!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
