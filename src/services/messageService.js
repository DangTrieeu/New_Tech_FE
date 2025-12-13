import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Message Service
 * Xử lý các API liên quan đến tin nhắn
 */

// Lấy lịch sử tin nhắn
export const getMessages = async (roomId, page = 1, limit = 50) => {
  const response = await axiosInstance.get(API_ENDPOINTS.MESSAGES(roomId), {
    params: { page, limit },
  });
  return response.data;
};

// Upload file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(
    API_ENDPOINTS.UPLOAD_FILE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
