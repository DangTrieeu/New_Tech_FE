import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Message Service
 * Xử lý các API liên quan đến tin nhắn
 */

// Lấy lịch sử tin nhắn
export const getMessages = async (roomId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.MESSAGES(roomId));
  return response.data;
};

// Recall message (thu hồi tin nhắn)
export const recallMessage = async (messageId) => {
  const response = await axiosInstance.put(`/api/messages/recall/${messageId}`);
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
