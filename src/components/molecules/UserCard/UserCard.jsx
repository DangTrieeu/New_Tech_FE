import React from 'react';
import Card from '../../atoms/Card/Card';
import Avatar from '../../atoms/Avatar/Avatar';
import Badge from '../../atoms/Badge/Badge';

const UserCard = ({ user, onClick }) => {
  const statusVariant = {
    'active': 'success',
    'locked': 'danger',
    'inactive': 'warning'
  };

  return (
    <Card hover onClick={onClick} padding="p-4">
      <div className="flex items-center gap-3">
        <Avatar 
          emoji={user.avatar} 
          size="medium" 
          isOnline={user.isOnline} 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </h4>
            <Badge variant={statusVariant[user.status]}>
              {user.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {user.email}
          </p>
          <div className="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-500">
            <span>{user.totalMessages} tin nhắn</span>
            <span>{user.roomsJoined} phòng</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
