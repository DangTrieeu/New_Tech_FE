import React from 'react';
import { X, FileText } from 'lucide-react';

const SummaryModal = ({ isOpen, onClose, summary, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
            <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              Tóm tắt cuộc trò chuyện
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Đang tạo tóm tắt...</p>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              <div className="prose max-w-none" style={{ color: 'var(--text-primary)' }}>
                <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: 'var(--text-secondary)' }}>Không có nội dung tóm tắt</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;

