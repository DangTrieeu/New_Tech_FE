import React from 'react';
import { MessageCircle, Phone, User, Info, Moon, Sun, LogOut } from 'lucide-react';
import Button from '../../atoms/Button/Button';

const SettingsMenu = ({ 
  onMessageClick,
  onContactsClick,
  onProfileClick,
  onAboutClick,
  onThemeToggle,
  onLogout,
  isDarkMode,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-full left-3 right-3 mb-2 rounded-lg shadow-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 -4px 12px var(--shadow)'
      }}
    >
      <div className="space-y-0.5 p-1.5">
        <Button
          onClick={onMessageClick}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
          className="hover:bg-opacity-100"
        >
          <MessageCircle size={18} className="mr-2" /> 
          <span>Message</span>
        </Button>
        <Button
          onClick={onContactsClick}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Phone size={18} className="mr-2" /> 
          <span>Danh bạ</span>
        </Button>
        <Button
          onClick={onProfileClick}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <User size={18} className="mr-2" /> 
          <span>Cá nhân</span>
        </Button>
        <Button
          onClick={onAboutClick}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Info size={18} className="mr-2" /> 
          <span>Giới thiệu</span>
        </Button>
        <Button
          onClick={onThemeToggle}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isDarkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
          <span>Chế độ {isDarkMode ? 'sáng' : 'tối'}</span>
        </Button>
        <hr style={{ borderColor: 'var(--border-color)', margin: '0.25rem 0' }} />
        <Button
          onClick={onLogout}
          variant="ghost"
          fullWidth
          style={{ 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0.75rem',
            backgroundColor: 'transparent',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LogOut size={18} className="mr-2" /> 
          <span>Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsMenu;
