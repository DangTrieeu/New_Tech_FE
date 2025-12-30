import React from 'react';
import Button from '@/components/atoms/Button/Button';
import { X } from 'lucide-react';

const RoomDetailModal = ({ isOpen, onClose, roomData }) => {
  if (!isOpen || !roomData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chi tiết Room</h2>
          <Button
            useTailwind
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X></X>
          </Button>
        </div>

        <div className="space-y-4">
          {/* Room Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Thông tin Room</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Tên Room</p>
                <p className="font-medium">{roomData.room.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  roomData.room.type === 'GROUP' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {roomData.room.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{roomData.room.createdByName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(roomData.room.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng Members</p>
                <p className="font-medium">{roomData.room.memberCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng Messages</p>
                <p className="font-medium">{roomData.room.totalMessages}</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Danh sách Members ({roomData.members.length})
            </h3>
            {roomData.members.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {roomData.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="p-3 bg-gray-50 rounded flex items-center gap-3 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={member.avatar_url || '/default-avatar.png'}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === 'ONLINE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">
                Room chưa có members
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
