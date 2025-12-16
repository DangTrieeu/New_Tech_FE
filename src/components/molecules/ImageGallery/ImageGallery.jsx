import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * ImageGallery Component
 * Hiển thị grid ảnh giống Zalo với lightbox viewer
 * Features: navigation, zoom, download
 */
const ImageGallery = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = async () => {
    const currentImage = images[currentIndex];
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentImage.filename || `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
      {/* Container with max size */}
      <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black bg-opacity-80">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-medium text-sm">
              {currentIndex + 1} / {images.length}
            </h3>
            {currentImage.sender && (
              <span className="text-gray-300 text-xs">
                Gửi bởi: {currentImage.sender.name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-white text-xs px-2">{Math.round(zoom * 100)}%</span>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 text-white"
              title="Tải xuống"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 text-white"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Image Viewer */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <div className="flex items-center justify-center max-w-full max-h-full p-4">
            <img
              src={currentImage.url}
              alt={currentImage.filename || 'Image'}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom})`,
                maxHeight: '60vh'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EKhông thể tải ảnh%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all"
              title="Ảnh tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="bg-black bg-opacity-80 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto max-w-full justify-center">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setZoom(1);
                  }}
                  className={`flex-shrink-0 rounded overflow-hidden transition-all ${
                    index === currentIndex
                      ? 'ring-2 ring-blue-500 opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{ width: '60px', height: '60px' }}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23333"/%3E%3C/svg%3E';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Info */}
        {currentImage.filename && (
          <div className="bg-black bg-opacity-80 px-3 py-2 text-center">
            <p className="text-gray-300 text-xs">{currentImage.filename}</p>
            {currentImage.created_at && (
              <p className="text-gray-400 text-[10px] mt-0.5">
                {new Date(currentImage.created_at).toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;

