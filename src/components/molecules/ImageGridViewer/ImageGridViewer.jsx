import React, { useState, useMemo, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import ImageGallery from '@/components/molecules/ImageGallery/ImageGallery';

/**
 * ImageGridViewer Component
 * Hiển thị grid tất cả ảnh trong cuộc trò chuyện
 * Giống Zalo - click vào ảnh để mở lightbox viewer
 */
const ImageGridViewer = ({ messages, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Extract all images from messages
  const images = useMemo(() => {
    if (!messages) return [];

    const imageMessages = messages.filter(msg => {
      if (msg.type !== 'FILE' || !msg.content) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      const urlLower = msg.content.toLowerCase();
      return imageExtensions.some(ext => urlLower.includes(ext));
    });

    return imageMessages.map(msg => ({
      url: msg.content,
      filename: msg.metadata?.originalName || msg.metadata?.filename || 'Image',
      sender: msg.sender,
      created_at: msg.created_at,
      message_id: msg.id,
    }));
  }, [messages]);

  // Listen for custom event to open gallery at specific index
  useEffect(() => {
    const handleOpenAtIndex = (event) => {
      const { index } = event.detail;
      if (index !== undefined && index >= 0 && index < images.length) {
        setSelectedImageIndex(index);
      }
    };

    window.addEventListener('openGalleryAtIndex', handleOpenAtIndex);
    return () => {
      window.removeEventListener('openGalleryAtIndex', handleOpenAtIndex);
    };
  }, [images.length]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseGallery = () => {
    setSelectedImageIndex(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Grid Modal - No dark background overlay */}
      <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div
          className="w-full max-w-4xl mx-4 rounded-lg shadow-xl max-h-[80vh] flex flex-col pointer-events-auto"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ảnh trong cuộc trò chuyện ({images.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <ImageIcon className="w-12 h-12 mb-3" style={{ color: 'var(--text-secondary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Chưa có ảnh nào trong cuộc trò chuyện
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {images.map((image, index) => (
                  <div
                    key={`${image.message_id}-${index}`}
                    className="relative aspect-square rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(index)}
                  >
                    {/* Image */}
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3EImg%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] truncate">
                        {new Date(image.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Lightbox */}
      {selectedImageIndex !== null && (
        <ImageGallery
          images={images}
          initialIndex={selectedImageIndex}
          onClose={handleCloseGallery}
        />
      )}
    </>
  );
};

export default ImageGridViewer;
