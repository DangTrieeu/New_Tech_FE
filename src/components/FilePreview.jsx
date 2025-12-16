import React from 'react';
import { X } from 'lucide-react';
import { formatFileSize, getFileIcon, isImage } from '@/utils/fileValidation';

/**
 * FilePreview Component
 * Displays preview of selected file before upload
 * Shows image preview or file icon with details
 * 
 * @param {File} file - The file to preview
 * @param {string} preview - Base64 preview for images
 * @param {Function} onRemove - Callback to remove the file
 */
const FilePreview = ({ file, preview, onRemove }) => {
  if (!file) return null;

  const fileIcon = getFileIcon(file.type);
  const isImageFile = isImage(file);

  // If it's an image, show only the image with remove button overlay
  if (isImageFile && preview) {
    return (
      <div className="relative group inline-block">
        <img
          src={preview}
          alt={file.name}
          className="max-w-full max-h-64 rounded-lg object-contain"
        />

        {/* Remove Button - Overlay on hover */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            type="button"
            title="Xóa ảnh"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* File info on hover - optional */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white px-3 py-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs truncate">{file.name}</p>
          <p className="text-xs">{formatFileSize(file.size)}</p>
        </div>
      </div>
    );
  }

  // For non-image files, keep the card layout
  return (
    <div 
      className="relative rounded-lg border p-3"
      style={{
        backgroundColor: 'var(--background-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded flex items-center justify-center text-3xl"
            style={{ backgroundColor: 'var(--hover-color)' }}
          >
            {fileIcon}
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p 
            className="font-medium truncate text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            {file.name}
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {formatFileSize(file.size)}
          </p>
          <p 
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {file.type || 'Unknown type'}
          </p>
        </div>

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
            type="button"
            title="Xóa file"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
