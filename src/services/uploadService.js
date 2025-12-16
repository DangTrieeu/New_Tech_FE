import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Upload Service
 * Handles file upload operations
 */

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Object>} - Upload result with url, filename, mimetype
 */
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(
    API_ENDPOINTS.UPLOAD_FILE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    }
  );

  return response.data;
};
import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Delays updating a value until after a specified delay
 * Useful for search inputs to avoid excessive API calls
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear timeout if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

