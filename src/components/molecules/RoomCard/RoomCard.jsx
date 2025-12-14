import React from 'react';
import Card from '../../atoms/Card/Card';
import Badge from '../../atoms/Badge/Badge';
import { Users, MessageCircle } from 'lucide-react';

const RoomCard = ({ room, onClick }) => {
  const typeVariant = {
    'public': 'success',
    'private': 'primary'
  };

  return (
    <Card hover onClick={onClick} padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate flex-1">
          {room.name}
        </h4>
        <Badge variant={typeVariant[room.type]}>
          {room.type}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{room.members.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>{room.totalMessages}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Tạo bởi {room.createdBy} • {new Date(room.createdAt).toLocaleDateString('vi-VN')}
      </div>
    </Card>
  );
};

export default RoomCard;
