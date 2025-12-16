// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth',
  REGISTER: '/users/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',

  // Users
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  SEARCH_USERS: '/users/search', // Fixed: removed /api prefix
  USER_BY_ID: (id) => `/users/${id}`,

  // Rooms (user routes)
  ROOMS: '/rooms',
  PRIVATE_ROOM: '/rooms/private',
  GROUP_ROOM: '/rooms/group',

  // Messages
  MESSAGES: (roomId) => `/api/messages/${roomId}`,
  UPLOAD_FILE: '/api/messages/upload',
};

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_CHARS: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 10,
};

// Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
};
