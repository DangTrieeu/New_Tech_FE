import React, { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import FilePreview from '@/components/FilePreview';
import { UPLOAD_CONFIG } from '@/config/api';

/**
 * FileUpload Component
 * Handles file upload with drag & drop, preview, and progress
 * Supports images, PDFs, and documents
 * 
 * @param {Function} onUploadSuccess - Callback when upload succeeds
 * @param {Function} onUploadError - Callback when upload fails
 * @param {boolean} autoUpload - Auto upload after file selection (default: false)
 */
const FileUpload = ({ 
  onUploadSuccess, 
  onUploadError,
  autoUpload = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    file,
    uploading,
    progress,
    error,
    preview,
    handleFileSelect,
    uploadFile,
    cancelUpload,
  } = useFileUpload(
    (result) => {
      if (onUploadSuccess) onUploadSuccess(result);
    },
    (err) => {
      if (onUploadError) onUploadError(err);
    }
  );

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await handleFileSelect(droppedFile);
      if (autoUpload && uploadFile) {
        setTimeout(() => uploadFile(), 100);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleFileSelect(selectedFile);
      if (autoUpload && uploadFile) {
        setTimeout(() => uploadFile(), 100);
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (file && !uploading && uploadFile) {
      await uploadFile();
    }
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
          className="relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
          style={{
            backgroundColor: isDragging ? 'var(--hover-color)' : 'var(--background-secondary)',
            borderColor: isDragging ? 'var(--primary-color)' : 'var(--border-color)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
            className="hidden"
          />

          <Upload
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: 'var(--primary-color)' }}
          />

          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            {isDragging ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
          </p>

          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Hỗ trợ: JPG, PNG, PDF, DOC, DOCX
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Kích thước tối đa: 10MB
          </p>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="space-y-3">
          <FilePreview
            file={file}
            preview={preview}
            onRemove={!uploading ? cancelUpload : null}
          />

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Đang tải lên...
                </span>
                <span style={{ color: 'var(--primary-color)' }}>
                  {progress}%
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--border-color)' }}
              >
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: 'var(--primary-color)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Upload Button (if not auto upload) */}
          {!autoUpload && !uploading && !error && (
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="w-full py-2.5 px-4 rounded-lg font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
              }}
            >
              Tải lên
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mt-3 p-3 rounded-lg flex items-start gap-2"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-600">Lỗi tải file</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
