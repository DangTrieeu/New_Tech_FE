import { useState } from 'react';
import { uploadFile as uploadFileService } from '@/services/uploadService';
import { validateFile } from '@/utils/fileValidation';

/**
 * useFileUpload Hook
 * Custom hook to handle file upload logic
 *
 * @param {Function} onSuccess - Callback when upload succeeds
 * @param {Function} onError - Callback when upload fails
 * @returns {Object} - Upload state and handlers
 */
export const useFileUpload = (onSuccess, onError) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    try {
      // Validate file
      validateFile(selectedFile);

      setFile(selectedFile);
      setError(null);

      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadFileService(file, (progress) => {
        setProgress(progress);
      });

      if (onSuccess) onSuccess(result);

      // Reset state after successful upload
      reset();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed';
      setError(errorMessage);
      if (onError) onError(err);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setError(null);
    setPreview(null);
  };

  const cancelUpload = () => {
    reset();
  };

  return {
    file,
    uploading,
    progress,
    error,
    preview,
    handleFileSelect,
    uploadFile,
    cancelUpload,
    reset,
  };
};

