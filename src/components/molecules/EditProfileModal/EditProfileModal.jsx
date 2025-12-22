import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/atoms/Button/Button';
import Input from '@/components/atoms/Input/Input';

const EditProfileModal = ({ onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({ name, avatar_url: avatarUrl });
      onClose();
    } catch (error) {
      console.error('Update profile failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ backgroundColor: 'var(--surface-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Chỉnh sửa hồ sơ
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Tên hiển thị
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              URL Avatar
            </label>
            <Input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            {avatarUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              fullWidth
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

