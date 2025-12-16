/**
 * File Validation Utilities
 * Validates file type and size before upload
 */

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate file type and size
 * @param {File} file - The file to validate
 * @throws {Error} - If validation fails
 * @returns {boolean} - True if valid
 */
export const validateFile = (file) => {
  if (!file) {
    throw new Error('Không có file nào được chọn');
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, PDF, DOC, DOCX');
  }

  // Check file size
  if (file.size > MAX_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`File quá lớn (${sizeMB}MB). Kích thước tối đa: 10MB`);
  }

  return true;
};

/**
 * Format file size to human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Check if file is an image
 * @param {File|string} file - File object or mime type
 * @returns {boolean}
 */
export const isImage = (file) => {
  const type = typeof file === 'string' ? file : file.type;
  return type.startsWith('image/');
};

/**
 * Get file icon based on type
 * @param {string} mimeType - File mime type
 * @returns {string} - Icon emoji
 */
export const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  return '📎';
};

export const UPLOAD_CONFIG = {
  MAX_SIZE,
  ALLOWED_TYPES,
  ALLOWED_EXTENSIONS,
};

