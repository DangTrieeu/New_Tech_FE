import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Enable sending cookies with requests
});

// Flag để tránh gọi refresh nhiều lần
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Kiểm tra cả admin token và user token
    const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý lỗi 401 và refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Không retry cho các auth endpoints (login, register, refresh)
    const authEndpoints = ['/auth', '/users/register', '/auth/refresh', '/auth/logout'];
    const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Lấy refreshToken từ localStorage
        const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('adminRefreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token - gửi refreshToken trong body
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }, // Gửi refreshToken trong body
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const newAccessToken = data.data?.accessToken || data.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        // Lưu access token mới - check xem đang dùng admin hay user token
        const isAdmin = localStorage.getItem('adminAccessToken');
        if (isAdmin) {
          localStorage.setItem('adminAccessToken', newAccessToken);
        } else {
          localStorage.setItem('accessToken', newAccessToken);
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, đăng xuất
        processQueue(refreshError, null);
        localStorage.clear();

        // Dispatch custom event để AuthContext có thể xử lý
        window.dispatchEvent(new CustomEvent('auth:logout'));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
