import React from 'react';
import Modal from '../../atoms/Modal/Modal';
import Button from '../../atoms/Button/Button';
import Avatar from '../../atoms/Avatar/Avatar';
import Badge from '../../atoms/Badge/Badge';

const UserDetailModal = ({ isOpen, onClose, user, onToggleLock, onDelete }) => {
  if (!user) return null;

  const statusVariant = {
    'active': 'success',
    'locked': 'danger',
    'inactive': 'warning'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết người dùng"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button 
            variant={user.status === 'locked' ? 'primary' : 'danger'}
            onClick={() => onToggleLock(user.id)}
          >
            {user.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
          </Button>
          <Button variant="danger" onClick={() => onDelete(user.id)}>
            Xóa người dùng
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Avatar emoji={user.avatar} size="large" isOnline={user.isOnline} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <Badge variant={statusVariant[user.status]}>
                {user.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Vai trò: <span className="font-medium">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tin nhắn</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.totalMessages}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Phòng tham gia</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.roomsJoined}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Ngày tham gia:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Hoạt động cuối:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {new Date(user.lastActive).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
