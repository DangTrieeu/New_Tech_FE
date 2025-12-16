import React from 'react';
import { Search, Plus, LogOut, MessageSquare } from 'lucide-react';
import { getRoomDisplayName } from '@/utils/dateUtils';

const ChatSidebar = ({
  user,
  rooms,
  selectedRoom,
  onSelectRoom,
  searchQuery,
  onSearchChange,
  searchResults,
  onCreatePrivateChat,
  onLogout,
}) => {
  const displayRooms = searchQuery ? searchResults : rooms;

  return (
    <div className="w-80 flex flex-col border-r" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center" style={{ color: 'var(--text-primary)' }}>
            <MessageSquare className="w-6 h-6 mr-2" />
            Chat
          </h2>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.username}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Create Group Button */}
        <button
          className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          onClick={() => {/* TODO: Implement group creation */}}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo nhóm mới
        </button>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {displayRooms.length === 0 ? (
          <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc trò chuyện nào'}
          </div>
        ) : (
          displayRooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id;
            const displayName = getRoomDisplayName(room, user?.id);
            const partner = room.type === 'PRIVATE' && room.participants?.[0];

            return (
              <div
                key={room.id}
                onClick={() => {
                  if (searchQuery && room.type === 'USER') {
                    // If it's a search result user, create private chat
                    onCreatePrivateChat(room.id);
                  } else {
                    // Otherwise select the room
                    onSelectRoom(room);
                  }
                }}
                className={`p-4 cursor-pointer border-b hover:bg-opacity-5 hover:bg-gray-500 transition-colors ${
                  isSelected ? 'bg-opacity-10 bg-blue-500' : ''
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                    {room.type === 'PRIVATE' ? (
                      partner?.avatar_url ? (
                        <img src={partner.avatar_url} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        displayName?.charAt(0).toUpperCase()
                      )
                    ) : room.type === 'GROUP' ? (
                      <div className="text-sm">{displayName?.substring(0, 2).toUpperCase()}</div>
                    ) : (
                      // Search result user
                      room.avatar_url ? (
                        <img src={room.avatar_url} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        displayName?.charAt(0).toUpperCase()
                      )
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {displayName}
                      </p>
                      {room.last_message_at && (
                        <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(room.last_message_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    
                    {room.last_message_content && (
                      <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                        {room.last_message_content}
                      </p>
                    )}

                    {room.type === 'GROUP' && room.participant_count && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {room.participant_count} thành viên
                      </p>
                    )}

                    {room.type === 'USER' && searchQuery && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {room.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
