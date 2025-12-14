import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card/Card';
import SearchInput from '../components/atoms/Input/SearchInput';
import Button from '../components/atoms/Button/Button';
import RoomTable from '../components/organisms/RoomTable/RoomTable';
import Modal from '../components/atoms/Modal/Modal';
import AdminService from '../services/adminService';
import { MessageSquare, ArrowLeft, Users, MessageCircle } from 'lucide-react';

const RoomManagementPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadRooms();
  }, [navigate]);

  useEffect(() => {
    // Filter rooms based on search query
    if (searchQuery.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = rooms.filter(room =>
        room.name.toLowerCase().includes(query) ||
        room.createdBy.toLowerCase().includes(query)
      );
      setFilteredRooms(filtered);
    }
  }, [searchQuery, rooms]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getRooms();
      setRooms(response.rooms);
      setFilteredRooms(response.rooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = async (room) => {
    try {
      const response = await AdminService.getRoomById(room.id);
      setSelectedRoom(response.room);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading room details:', error);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      return;
    }

    try {
      await AdminService.deleteRoom(roomId);
      await loadRooms();
      setIsModalOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MessageSquare size={24} className="text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý phòng chat
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredRooms.length} phòng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phòng..."
              />
            </div>
          </div>
        </Card>

        <Card padding="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              Đang tải...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              Không tìm thấy phòng
            </div>
          ) : (
            <RoomTable
              rooms={filteredRooms}
              onRoomClick={handleRoomClick}
              onDelete={handleDelete}
            />
          )}
        </Card>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Chi tiết phòng chat"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Đóng
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selectedRoom.id)}>
                Xóa phòng
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedRoom.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loại: <span className="font-medium capitalize">{selectedRoom.type}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Users size={16} />
                  <p className="text-sm">Thành viên</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedRoom.members.length}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <MessageCircle size={16} />
                  <p className="text-sm">Tin nhắn</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedRoom.totalMessages}
                </p>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh sách thành viên:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                {selectedRoom.members.map((member, index) => (
                  <div key={index} className="text-sm text-gray-900 dark:text-white py-1">
                    • {member}
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Người tạo:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {selectedRoom.createdBy}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {new Date(selectedRoom.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoomManagementPage;
