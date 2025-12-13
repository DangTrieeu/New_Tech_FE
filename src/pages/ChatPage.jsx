import React, { useState, useEffect } from 'react';
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
  Send,
  Paperclip,
  Smile,
  Phone,
  Video
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useTheme } from '@/hooks/useTheme';
import * as roomService from '@/services/roomService';
import * as messageService from '@/services/messageService';
import * as userService from '@/services/userService';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { socket, joinRoom, sendMessage, onReceiveMessage } = useSocket();
  const { isDarkMode, toggleTheme } = useTheme();

  // States
  const [activeTab, setActiveTab] = useState('messages'); // messages, contacts, profile, about
  const [showSettings, setShowSettings] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  // Define functions before useEffect
  const loadRooms = async () => {
    try {
      const response = await roomService.getRooms();
      setRooms(response.data || response.rooms || []);
    } catch (error) {
      console.error('Load rooms failed:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      setLoading(true);
      const response = await messageService.getMessages(roomId);
      setMessages(response.data || response.messages || []);
    } catch (error) {
      console.error('Load messages failed:', error);
      toast.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const unsubscribe = onReceiveMessage((message) => {
      if (selectedRoom && message.room_id === selectedRoom.id) {
        setMessages((prev) => [...prev, message]);
      }
      // Update room list
      loadRooms();
    });

    return unsubscribe;
  }, [socket, selectedRoom]);

  // Load messages when room selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      joinRoom(selectedRoom.id);
      setShowRoomInfo(false);
    }
  }, [selectedRoom]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoom) return;

    const messageData = {
      roomId: selectedRoom.id,
      content: messageInput.trim(),
      type: 'TEXT',
    };

    sendMessage(messageData);
    setMessageInput('');
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await userService.searchUsers(query);
      setSearchResults(response.data || response.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCreatePrivateChat = async (partnerId) => {
    try {
      const response = await roomService.createPrivateRoom(partnerId);
      const room = response.data || response.room;
      setSelectedRoom(room);
      await loadRooms();
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Create room failed:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      await logout();
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* LEFT SIDEBAR - Chat List */}
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
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
              onClick={handleLogout}
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
                  onClick={() => handleCreatePrivateChat(searchUser.id)}
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
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full flex items-center p-3 hover:bg-opacity-10 hover:bg-gray-500 ${
                    selectedRoom?.id === room.id ? 'bg-opacity-10 bg-blue-500' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                    {room.type === 'PRIVATE' ? (
                      room.partner?.avatar_url ? (
                        <img src={room.partner.avatar_url} alt={room.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        room.name?.charAt(0).toUpperCase()
                      )
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {room.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {room.last_message?.content || 'Chưa có tin nhắn'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* MIDDLE - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                  {selectedRoom.type === 'PRIVATE' && selectedRoom.partner?.avatar_url ? (
                    <img src={selectedRoom.partner.avatar_url} alt={selectedRoom.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    selectedRoom.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedRoom.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {selectedRoom.type === 'PRIVATE' ? 'Trực tuyến' : `${selectedRoom.participant_count || 0} thành viên`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowRoomInfo(!showRoomInfo)}
                  className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background-color)' }}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: 'var(--text-secondary)' }}>Chưa có tin nhắn nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          {!isOwn && (
                            <p className="text-xs mb-1 px-2" style={{ color: 'var(--text-secondary)' }}>
                              {msg.sender?.name || 'Unknown'}
                            </p>
                          )}
                          <div
                            className="px-4 py-2 rounded-2xl"
                            style={{
                              backgroundColor: isOwn ? 'var(--primary-color)' : 'var(--surface-color)',
                              color: isOwn ? '#fff' : 'var(--text-primary)',
                            }}
                          >
                            <p className="break-words">{msg.content}</p>
                          </div>
                          <p className="text-xs mt-1 px-2" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2 rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
            <div className="text-center">
              <MessageCircle className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR - Room Info */}
      {showRoomInfo && selectedRoom && (
        <div
          className="w-80 border-l overflow-y-auto"
          style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-3">
                {selectedRoom.type === 'PRIVATE' && selectedRoom.partner?.avatar_url ? (
                  <img src={selectedRoom.partner.avatar_url} alt={selectedRoom.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  selectedRoom.name?.charAt(0).toUpperCase()
                )}
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {selectedRoom.name}
              </h3>
              {selectedRoom.type === 'PRIVATE' && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedRoom.partner?.email}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Thông tin
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loại</p>
                    <p style={{ color: 'var(--text-primary)' }}>
                      {selectedRoom.type === 'PRIVATE' ? 'Trò chuyện riêng' : 'Nhóm'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày tạo</p>
                    <p style={{ color: 'var(--text-primary)' }}>
                      {new Date(selectedRoom.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRoom.type === 'GROUP' && (
                <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Thành viên ({selectedRoom.participant_count || 0})
                  </h4>
                  {/* Add members list here */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

