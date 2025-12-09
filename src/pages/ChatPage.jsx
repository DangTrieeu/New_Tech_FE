import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const ChatPage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu mẫu cho danh sách chat
  const [chatList] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: '👤',
      lastMessage: 'Hello, how are you?',
      time: '10:30',
      unread: 2,
      online: true,
      type: 'personal'
    },
    {
      id: 2,
      name: 'Nhóm Dự Án',
      avatar: '👥',
      lastMessage: 'Meeting lúc 2pm nhé',
      time: '09:15',
      unread: 0,
      online: false,
      type: 'group',
      members: ['User 1', 'User 2', 'User 3']
    },
    {
      id: 3,
      name: 'Trần Thị B',
      avatar: '👤',
      lastMessage: 'Cảm ơn bạn nhé!',
      time: 'Hôm qua',
      unread: 0,
      online: false,
      type: 'personal'
    },
  ]);

  // Dữ liệu mẫu cho tin nhắn
  const [messages, setMessages] = useState([
    { id: 1, text: 'Chào bạn!', sender: 'other', time: '10:00' },
    { id: 2, text: 'Hello, how are you?', sender: 'other', time: '10:30' },
    { id: 3, text: 'Tôi khỏe, cảm ơn bạn!', sender: 'me', time: '10:31' },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        text: messageInput,
        sender: 'me',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Left Sidebar - Danh sách chat */}
      <div className="w-80 flex flex-col border-r" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Chat</h1>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: 'var(--hover-color)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="flex items-center p-3 cursor-pointer transition-colors"
              style={{
                backgroundColor: selectedChat?.id === chat.id ? 'var(--hover-color)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (selectedChat?.id !== chat.id) {
                  e.currentTarget.style.backgroundColor = 'var(--hover-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChat?.id !== chat.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'var(--hover-color)' }}>
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2"
                    style={{ borderColor: 'var(--surface-color)' }}></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {chat.name}
                  </h3>
                  <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Settings */}
        <div className="relative border-t p-3" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
          >
            <span className="text-xl mr-2">⚙️</span>
            <span className="font-medium">Cài đặt</span>
          </button>

          {/* Settings Menu */}
          {showSettings && (
            <div
              className="absolute bottom-full left-3 right-3 mb-2 rounded-lg shadow-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 -4px 12px var(--shadow)'
              }}
            >
              <button
                onClick={() => {
                  setShowSettings(false);
                  navigate('/chat');
                }}
                className="w-full px-4 py-3 text-left flex items-center transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="mr-3">💬</span> Tin nhắn
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  navigate('/contacts');
                }}
                className="w-full px-4 py-3 text-left flex items-center transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="mr-3">📖</span> Danh bạ
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  navigate('/profile');
                }}
                className="w-full px-4 py-3 text-left flex items-center transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="mr-3">👤</span> Cá nhân
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  navigate('/about');
                }}
                className="w-full px-4 py-3 text-left flex items-center transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="mr-3">ℹ️</span> Giới thiệu
              </button>
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-3 text-left flex items-center transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="mr-3">{isDarkMode ? '☀️' : '🌙'}</span> {isDarkMode ? 'Sáng' : 'Tối'}
              </button>
              <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left flex items-center text-red-500 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="mr-3">🚪</span> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                  style={{ backgroundColor: 'var(--hover-color)' }}>
                  {selectedChat.avatar}
                </div>
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedChat.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {selectedChat.online ? 'Đang hoạt động' : 'Không hoạt động'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--primary-color)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-xl">{showRightPanel ? '➡️' : '⬅️'}</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background-color)' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className="px-4 py-2 rounded-2xl inline-block"
                      style={{
                        backgroundColor: msg.sender === 'me' ? 'var(--primary-color)' : 'var(--surface-color)',
                        color: msg.sender === 'me' ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--primary-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="text-xl">📎</span>
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--primary-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="text-xl">🖼️</span>
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-full outline-none"
                  style={{
                    backgroundColor: 'var(--hover-color)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                />
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--primary-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="text-xl">😊</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                >
                  Gửi
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Chào mừng đến với Chat
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Info Panel */}
      {showRightPanel && selectedChat && (
        <div className="w-80 border-l overflow-y-auto"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
          {/* Profile Info */}
          <div className="p-6 text-center border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
              style={{ backgroundColor: 'var(--hover-color)' }}>
              {selectedChat.avatar}
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {selectedChat.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedChat.online ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b grid grid-cols-3 gap-3" style={{ borderColor: 'var(--border-color)' }}>
            <button className="flex flex-col items-center p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}>
              <span className="text-2xl mb-1">🔔</span>
              <span className="text-xs">Tắt thông báo</span>
            </button>
            <button className="flex flex-col items-center p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}>
              <span className="text-2xl mb-1">📌</span>
              <span className="text-xs">Ghim</span>
            </button>
            <button className="flex flex-col items-center p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}>
              <span className="text-2xl mb-1">🔍</span>
              <span className="text-xs">Tìm kiếm</span>
            </button>
          </div>

          {/* Group Members (if group chat) */}
          {selectedChat.type === 'group' && (
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Thành viên nhóm
              </h4>
              {selectedChat.members?.map((member, index) => (
                <div key={index} className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                    style={{ backgroundColor: 'var(--hover-color)' }}>
                    👤
                  </div>
                  <span style={{ color: 'var(--text-primary)' }}>{member}</span>
                </div>
              ))}
            </div>
          )}

          {/* Shared Media */}
          <div className="p-4">
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Ảnh & Video
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'var(--hover-color)' }}>
                  🖼️
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button className="w-full text-left px-3 py-2 rounded-lg transition-colors mb-2"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🔒 Mã hóa đầu cuối
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-red-500"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🚫 Chặn người dùng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

