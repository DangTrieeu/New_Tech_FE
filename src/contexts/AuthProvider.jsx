import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '@/services/authService';
import * as userService from '@/services/userService';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Listen for auto-logout event from axios interceptor
  useEffect(() => {
    const handleAutoLogout = () => {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      toast.error('Phiên đăng nhập đã hết hạn');
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, [navigate]);

  // Kiểm tra token khi app khởi động - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    if (!initialized) {
      checkAuth();
    }
  }, [initialized]);

  const checkAuth = async () => {
    // Kiểm tra cả admin token và user token
    const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken');

    // Nếu không có token, không gọi API
    if (!token) {
      setLoading(false);
      setInitialized(true);
      setIsAuthenticated(false);
      return;
    }

    try {
      // Lấy thông tin user từ API
      const response = await userService.getProfile();
      const userData = response.data || response.user;
      setUser(userData);
      setAccessToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      // Xử lý lỗi xác thực một cách yên lặng
      if (error.response?.status === 401) {
        console.log('Token expired or invalid, clearing auth...');
      } else {
        console.error('Auth check failed:', error);
      }
      // Clear tất cả thông tin xác thực (cả admin và user)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Làm mới access token (được gọi từ axios interceptor hoặc manual)
  const refreshAccessToken = async () => {
    try {
      const response = await authService.refreshToken();
      const newToken = response.data?.accessToken || response.accessToken;

      if (newToken) {
        localStorage.setItem('accessToken', newToken);
        setAccessToken(newToken);
        return newToken;
      }

      throw new Error('No access token in refresh response');
    } catch (error) {
      console.error('Refresh token failed:', error);
      // Clear auth state
      localStorage.clear();
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      // Clear any old tokens before login to avoid sending invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');

      console.log('[AuthProvider] Attempting login with:', { email });

      const response = await authService.login(email, password);

      console.log('[AuthProvider] Login response received:', {
        hasData: !!response,
        hasDataProperty: !!response?.data,
        dataKeys: response?.data ? Object.keys(response.data) : [],
        responseKeys: Object.keys(response)
      });

      // authService.login returns response.data from axios
      // Backend returns: { status, message, data: { accessToken, refreshToken, user } }
      // So we need to access response.data to get the actual payload
      const payload = response.data || response;

      console.log('[AuthProvider] Payload extracted:', {
        hasAccessToken: !!payload?.accessToken,
        hasRefreshToken: !!payload?.refreshToken,
        hasUser: !!payload?.user,
        userRole: payload?.user?.role
      });

      // Kiểm tra response có đúng format không
      if (!payload || !payload.accessToken || !payload.refreshToken) {
        console.error('[AuthProvider] Invalid response structure:', { response, payload });
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
        console.log('[AuthProvider] Admin tokens saved to localStorage');
      } else {
        localStorage.setItem('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        console.log('[AuthProvider] User tokens saved to localStorage');
      }

      setUser(userData);
      setAccessToken(payload.accessToken);
      setIsAuthenticated(true);
      setLoading(false);

      console.log('[AuthProvider] Login successful, state updated:', {
        userId: userData.id,
        userName: userData.name,
        isAdmin,
        isAuthenticated: true
      });

      toast.success('Đăng nhập thành công!');

      return { userData, isAdmin: userData.role === 'ADMIN' };
    } catch (error) {
      console.error('[AuthProvider] Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const message = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      toast.error(message);
      throw error;
    }
  };

  // Google OAuth Login
  const loginWithGoogle = () => {
    authService.initiateGoogleLogin();
  };

  // Handle Google OAuth Success (called from OAuthSuccessPage)
  const handleGoogleAuthSuccess = async (accessTokenFromCookie) => {
    try {
      // Store access token
      if (accessTokenFromCookie) {
        localStorage.setItem('accessToken', accessTokenFromCookie);
        setAccessToken(accessTokenFromCookie);
      }

      // Get user profile
      const response = await userService.getProfile();
      const userData = response.data || response.user;

      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);

      toast.success('Đăng nhập Google thành công!');
      return userData;
    } catch (error) {
      console.error('Google auth failed:', error);
      localStorage.clear();
      toast.error('Xác thực Google thất bại');
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
      setAccessToken(null);
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
    accessToken,
    loading,
    isAuthenticated,
    login,
    loginWithGoogle,
    handleGoogleAuthSuccess,
    register,
    logout,
    updateUserProfile,
    changePassword,
    checkAuth,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
