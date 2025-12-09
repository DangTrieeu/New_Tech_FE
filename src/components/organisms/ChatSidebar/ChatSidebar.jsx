import React from 'react';
import { Settings } from 'lucide-react';
import SearchBar from '../../molecules/SearchBar/SearchBar';
import ChatListItem from '../../molecules/ChatListItem/ChatListItem';
import Button from '../../atoms/Button/Button';
import SettingsMenu from '../SettingsMenu/SettingsMenu';

const ChatSidebar = ({ 
  searchQuery,
  onSearchChange,
  chats,
  selectedChatId,
  onChatSelect,
  onSettingsClick,
  showSettings,
  onMessageClick,
  onContactsClick,
  onProfileClick,
  onAboutClick,
  onThemeToggle,
  onLogout,
  isDarkMode
}) => {
  return (
    <div className="w-80 flex flex-col border-r" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Chat</h1>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Tìm kiếm"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <ChatListItem
            key={chat.id}
            avatar={chat.avatar}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
            unread={chat.unread}
            online={chat.online}
            isSelected={selectedChatId === chat.id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>

      {/* Bottom Settings */}
      <div className="relative border-t p-3" style={{ borderColor: 'var(--border-color)' }}>
        <Button
          onClick={onSettingsClick}
          variant="ghost"
          fullWidth
          style={{ backgroundColor: 'var(--hover-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Settings size={20} className="mr-2" />
          <span className="font-medium">Cài đặt</span>
        </Button>

        {/* Settings Menu */}
        {showSettings && (
          <div className="absolute bottom-full left-3 right-3 mb-2">
            <SettingsMenu
              isVisible={true}
              onMessageClick={onMessageClick}
              onContactsClick={onContactsClick}
              onProfileClick={onProfileClick}
              onAboutClick={onAboutClick}
              onThemeToggle={onThemeToggle}
              onLogout={onLogout}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
