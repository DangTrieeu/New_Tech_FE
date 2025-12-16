import React, { useRef } from 'react';
import { Send, Paperclip, Smile, Loader2, X } from 'lucide-react';

const MessageInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  onFileSelect,
  uploading,
  uploadProgress,
  selectedFile,
  onCancelUpload,
  placeholder
}) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
      {/* File Upload Progress */}
      {uploading && (
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--primary-color)' }} />
            <span style={{ color: 'var(--text-secondary)'}}>Đang tải file lên...</span>
            <span style={{ color: 'var(--primary-color)' }} className="ml-auto">{uploadProgress}%</span>
          </div>
          <div
            className="w-full h-1 rounded-full mt-2 overflow-hidden"
            style={{ backgroundColor: 'var(--border-color)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: 'var(--primary-color)',
              }}
            />
          </div>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && !uploading && (
        <div className="px-4 pt-3 pb-2">
          <div
            className="flex items-center gap-2 p-2 rounded"
            style={{ backgroundColor: 'var(--hover-color)' }}
          >
            <Paperclip className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
              {selectedFile.name}
            </span>
            {onCancelUpload && (
              <button
                onClick={onCancelUpload}
                className="p-1 rounded hover:bg-red-100"
                type="button"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            className="hidden"
          />

          {/* Paperclip Button */}
          <button
            type="button"
            onClick={handleFileClick}
            disabled={uploading}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}
            title="Đính kèm file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Emoji Button */}
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={uploading}
            placeholder={uploading ? "Đang tải file..." : (placeholder || "Nhập tin nhắn...")}
            className="flex-1 px-4 py-2 rounded-lg outline-none transition-colors"
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || uploading}
            className="p-2 rounded-lg disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
            title="Gửi tin nhắn"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
