import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Users,
  User,
  Info,
  LogOut,
  Settings,
  Moon,
  Sun,
  Search,
  UserPlus,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getRoomDisplayName } from '@/utils/dateUtils';
import CreateGroupModal from '@/components/molecules/CreateGroupModal/CreateGroupModal';

const ChatSidebar = ({
  user,
  rooms,
  selectedRoom,
  onSelectRoom,
  searchQuery,
  onSearchChange,
  searchResults,
  onCreatePrivateChat,
  onGroupCreated,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false);

  const handleGroupCreated = (newRoom) => {
    if (onGroupCreated) {
      onGroupCreated(newRoom);
    }
  };

  return (
    <div
      className="w-80 flex flex-col border-r"
      style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}
    >
      {/* Header with User Info */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Chat App
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              style={{ color: 'var(--text-secondary)' }}
              title="Tạo nhóm mới"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          />
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="border-b p-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background-color)' }}>
          <button
            onClick={() => { navigate('/profile'); setShowSettings(false); }}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-primary)' }}
          >
            <User className="w-4 h-4 mr-3" />
            Cá nhân
          </button>
          <button
            onClick={() => { navigate('/contacts'); setShowSettings(false); }}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-primary)' }}
          >
            <Users className="w-4 h-4 mr-3" />
            Danh bạ
          </button>
          <button
            onClick={() => { navigate('/about'); setShowSettings(false); }}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-primary)' }}
          >
            <Info className="w-4 h-4 mr-3" />
            Giới thiệu
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-primary)' }}
          >
            {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
            {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-red-500 text-red-500"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Đăng xuất
          </button>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <p className="px-3 py-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Kết quả tìm kiếm
            </p>
            {searchResults.map((searchUser) => (
              <button
                key={searchUser.id}
                onClick={() => onCreatePrivateChat(searchUser.id)}
                className="w-full flex items-center p-3 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                  {searchUser.avatar_url ? (
                    <img src={searchUser.avatar_url} alt={searchUser.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    searchUser.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {searchUser.name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {searchUser.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Room List */}
      {!searchQuery && (
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageCircle className="w-12 h-12 mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                Chưa có cuộc trò chuyện nào
              </p>
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`w-full flex items-center p-3 hover:bg-opacity-10 hover:bg-gray-500 ${selectedRoom?.id === room.id ? 'bg-opacity-10 bg-blue-500' : ''
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                  {room.type === 'PRIVATE' ? (
                    room.participants?.[0]?.avatar_url ? (
                      <img src={room.participants[0].avatar_url} alt={getRoomDisplayName(room, user?.id)} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      getRoomDisplayName(room, user?.id)?.charAt(0).toUpperCase()
                    )
                  ) : (
                    <Users className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {getRoomDisplayName(room, user?.id)}
                  </p>
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {room.messages?.[0]?.content || 'Chưa có tin nhắn'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSuccess={handleGroupCreated}
        currentUserId={user?.id}
      />
    </div>
  );
};

export default ChatSidebar;

