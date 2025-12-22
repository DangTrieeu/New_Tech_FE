import React from 'react';
import { Users, Info, Sparkles, Image } from 'lucide-react';
import { getRoomDisplayName } from '@/utils/dateUtils';
import Button from '../../atoms/Button/Button';

const ChatHeader = ({ room, currentUserId, onToggleInfo, onSummarize, onShowImageGallery }) => {
  if (!room) return null;

  const partner = room.type === 'PRIVATE' && room.participants?.[0];
  const displayName = getRoomDisplayName(room, currentUserId);

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
          {room.type === 'PRIVATE' ? (
            partner?.avatar_url ? (
              <img src={partner.avatar_url} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              displayName?.charAt(0).toUpperCase()
            )
          ) : (
            <Users className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {room.type === 'PRIVATE' ? 'Trực tuyến' : `${room.participant_count || 0} thành viên`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onSummarize && (
          <Button
            variant="ghost"
            onClick={onSummarize}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: 'var(--primary-color)', padding: 5 }}
            title="Tóm tắt cuộc trò chuyện"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        )}
        {onShowImageGallery && (
          <Button
            variant="ghost"
            onClick={onShowImageGallery}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: 'var(--text-secondary)', padding: 5 }}
            title="Xem ảnh"
          >
            <Image className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onToggleInfo}
          className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
          style={{ color: 'var(--text-secondary)', padding: 5 }}
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
