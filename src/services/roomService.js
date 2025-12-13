import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Room Service
 * Xử lý các API liên quan đến phòng chat
 */

// Lấy danh sách phòng chat
export const getRooms = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ROOMS);
  return response.data;
};

// Tạo/lấy phòng chat 1-1
export const createPrivateRoom = async (partnerId) => {
  const response = await axiosInstance.post(API_ENDPOINTS.PRIVATE_ROOM, {
    partnerId,
  });
  return response.data;
};

// Tạo nhóm chat
export const createGroupRoom = async (name, participantIds) => {
  const response = await axiosInstance.post(API_ENDPOINTS.GROUP_ROOM, {
    name,
    participantIds,
  });
  return response.data;
};

