import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import Button from '@/components/atoms/Button/Button';

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllRooms({});
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Lỗi tải danh sách rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Bạn có chắc muốn xóa room này?')) return;

    try {
      await adminService.deleteRoom(roomId);
      toast.success('Xóa room thành công');
      fetchRooms();
      setOpenDropdown(null);
    } catch (error) {
      toast.error('Lỗi xóa room');
    }
  };

  const viewRoomDetail = async (roomId) => {
    try {
      const response = await adminService.getRoomById(roomId);
      setSelectedRoom(response.data);
      setOpenDropdown(null);
    } catch (error) {
      toast.error('Lỗi tải chi tiết room');
    }
  };

  const toggleDropdown = (roomId) => {
    setOpenDropdown(openDropdown === roomId ? null : roomId);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rooms Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">Đang tải...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Members</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Messages</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{room.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{room.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${room.type === 'GROUP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{room.createdByName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{room.memberCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{room.totalMessages}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="relative">
                      <Button
                        useTailwind
                        onClick={() => toggleDropdown(room.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </Button>

                      {/* Dropdown Menu */}
                      {openDropdown === room.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                        >
                          <div className="py-1">
                            <Button
                              useTailwind
                              onClick={() => viewRoomDetail(room.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                            <Button
                              useTailwind
                              onClick={() => handleDeleteRoom(room.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Room
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết Room</h2>
              <Button
                useTailwind
                onClick={() => setSelectedRoom(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Thông tin Room</h3>
                <p><strong>Tên:</strong> {selectedRoom.room.name}</p>
                <p><strong>Type:</strong> {selectedRoom.room.type}</p>
                <p><strong>Created by:</strong> {selectedRoom.room.createdByName}</p>
                <p><strong>Tổng Members:</strong> {selectedRoom.room.memberCount}</p>
                <p><strong>Tổng Messages:</strong> {selectedRoom.room.totalMessages}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Danh sách Members</h3>
                <div className="space-y-2">
                  {selectedRoom.members.map((member) => (
                    <div key={member.id} className="p-3 bg-gray-50 rounded flex items-center gap-3">
                      <img
                        src={member.avatar_url || '/default-avatar.png'}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${member.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementPage;
