import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, Image as ImageIcon, Smile, Bell, Pin, Search, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import ChatSidebar from '../components/organisms/ChatSidebar/ChatSidebar';
import Button from '../components/atoms/Button/Button';
import IconButton from '../components/atoms/Button/IconButton';
import Input from '../components/atoms/Input/Input';
import Avatar from '../components/atoms/Avatar/Avatar';

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
      {/* Left Sidebar - Chat List */}
      <ChatSidebar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        chats={filteredChats}
        selectedChatId={selectedChat?.id}
        onChatSelect={setSelectedChat}
        onSettingsClick={() => setShowSettings(!showSettings)}
        showSettings={showSettings}
        // SettingsMenu props
        onMessageClick={() => {
          setShowSettings(false);
          navigate('/chat');
        }}
        onContactsClick={() => {
          setShowSettings(false);
          navigate('/contacts');
        }}
        onProfileClick={() => {
          setShowSettings(false);
          navigate('/profile');
        }}
        onAboutClick={() => {
          setShowSettings(false);
          navigate('/about');
        }}
        onThemeToggle={() => {
          toggleTheme();
          setShowSettings(false);
        }}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      {/* Center - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
              <div className="flex items-center">
                <div className="mr-3">
                  <Avatar emoji={selectedChat.avatar} size="medium" online={selectedChat.online} />
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
              <IconButton
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? 'Ẩn panel' : 'Hiện panel'}
              >
                {showRightPanel ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </IconButton>
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
                <IconButton type="button" title="Đính kèm file">
                  <Paperclip size={20} />
                </IconButton>
                <IconButton type="button" title="Gửi ảnh">
                  <ImageIcon size={20} />
                </IconButton>
                <Input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  style={{ borderRadius: '9999px' }}
                />
                <IconButton type="button" title="Emoji">
                  <Smile size={20} />
                </IconButton>
                <Button type="submit" variant="primary" style={{ borderRadius: '9999px' }}>
                  Gửi
                </Button>
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
            <div className="mx-auto mb-3">
              <Avatar emoji={selectedChat.avatar} size="large" online={selectedChat.online} />
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
            <IconButton style={{ flexDirection: 'column', height: 'auto', padding: '0.75rem' }}>
              <Bell size={24} className="mb-1" />
              <span className="text-xs">Tắt thông báo</span>
            </IconButton>
            <IconButton style={{ flexDirection: 'column', height: 'auto', padding: '0.75rem' }}>
              <Pin size={24} className="mb-1" />
              <span className="text-xs">Ghim</span>
            </IconButton>
            <IconButton style={{ flexDirection: 'column', height: 'auto', padding: '0.75rem' }}>
              <Search size={24} className="mb-1" />
              <span className="text-xs">Tìm kiếm</span>
            </IconButton>
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
              <Lock size={18} className="mr-2" /> Mã hóa đầu cuối
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

