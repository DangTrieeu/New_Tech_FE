import React from 'react';
import Avatar from '../../atoms/Avatar/Avatar';

const ContactItem = ({ 
  avatar = '👤',
  name,
  status = 'offline',
  onClick,
  showBorder = true,
  className = ''
}) => {
  const isOnline = status === 'online';

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer transition-colors ${className}`}
      style={{
        borderBottom: showBorder ? '1px solid var(--border-color)' : 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="mr-4">
        <Avatar emoji={avatar} online={isOnline} />
      </div>
      <div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {name}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
        </p>
      </div>
    </div>
  );
};

export default ContactItem;
