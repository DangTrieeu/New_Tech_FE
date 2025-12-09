import React from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import Badge from '../../atoms/Badge/Badge';

const ChatListItem = ({ 
  avatar = '👤',
  name,
  lastMessage,
  time,
  unread = 0,
  online = false,
  isSelected = false,
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-colors ${className}`}
      style={{
        backgroundColor: isSelected ? 'var(--hover-color)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'var(--hover-color)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div className="mr-3">
        <Avatar emoji={avatar} online={online} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {name}
          </h3>
          <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
            {time}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
            {lastMessage}
          </p>
          {unread > 0 && (
            <div className="ml-2 flex-shrink-0">
              <Badge variant="danger" size="small">
                {unread}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
