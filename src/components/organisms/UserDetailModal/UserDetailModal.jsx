import React from 'react';
import Button from '@/components/atoms/Button/Button';
import { X } from 'lucide-react';

const UserDetailModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chi tiết User</h2>
          <Button
            useTailwind
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X></X>
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <p className="font-medium">{userData.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  userData.user.role === 'ADMIN' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userData.user.role}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  userData.user.status === 'ONLINE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userData.user.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng Rooms</p>
                <p className="font-medium">{userData.user.totalRoomsJoined}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng Messages</p>
                <p className="font-medium">{userData.user.totalMessagesSent}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Rooms đã tham gia ({userData.rooms.length})
            </h3>
            {userData.rooms.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userData.rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{room.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            room.type === 'GROUP' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {room.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {room.totalMessages} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">
                Chưa tham gia room nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
