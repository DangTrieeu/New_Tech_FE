import axiosInstance from '@/api/axios';

/**
 * AI Service
 * Xử lý các API liên quan đến AI features
 */

const AI_BASE_URL = '/api/ai';

// Chat với AI Assistant (FR-020)
export const chatWithAI = async (roomId, question) => {
  const response = await axiosInstance.post(`${AI_BASE_URL}/chat`, {
    roomId,
    question,
  });
  return response.data;
};

// Gợi ý trả lời nhanh (FR-021)
export const getSmartReply = async (messageId) => {
  const response = await axiosInstance.post(`${AI_BASE_URL}/smart-reply`, {
    messageId,
  });
  return response.data;
};

// Tóm tắt cuộc hội thoại (FR-022)
export const summarizeConversation = async (roomId, messageLimit = 20) => {
  const response = await axiosInstance.post(`${AI_BASE_URL}/summarize`, {
    roomId,
    messageLimit,
  });
  return response.data;
};

// Quản lý Cache - Xem thống kê
export const getCacheStats = async () => {
  const response = await axiosInstance.get(`${AI_BASE_URL}/cache/stats`);
  return response.data;
};

// Quản lý Cache - Xóa cache
export const clearCache = async () => {
  const response = await axiosInstance.delete(`${AI_BASE_URL}/cache`);
  return response.data;
};
