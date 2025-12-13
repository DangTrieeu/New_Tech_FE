// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth',
  REGISTER: '/users/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',

  // Users
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  SEARCH_USERS: '/users/search',
  USER_BY_ID: (id) => `/users/${id}`,

  // Rooms
  ROOMS: '/api/rooms',
  PRIVATE_ROOM: '/api/rooms/private',
  GROUP_ROOM: '/api/rooms/group',

  // Messages
  MESSAGES: (roomId) => `/api/messages/${roomId}`,
  UPLOAD_FILE: '/api/messages/upload',
};

