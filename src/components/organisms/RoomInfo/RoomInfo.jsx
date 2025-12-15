import React from 'react';
import { Users } from 'lucide-react';
import { getRoomDisplayName } from '@/utils/dateUtils';

const RoomInfo = ({ room, currentUserId }) => {
  if (!room) return null;

  const partner = room.type === 'PRIVATE' && room.participants?.[0];
  const displayName = getRoomDisplayName(room, currentUserId);

  return (
    <div
      className="w-80 border-l overflow-y-auto"
      style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-3">
            {room.type === 'PRIVATE' ? (
              partner?.avatar_url ? (
                <img src={partner.avatar_url} alt={displayName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                displayName?.charAt(0).toUpperCase()
              )
            ) : (
              <Users className="w-16 h-16" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </h3>
          {room.type === 'PRIVATE' && partner?.email && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {partner.email}
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
                  {room.type === 'PRIVATE' ? 'Trò chuyện riêng' : 'Nhóm'}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày tạo</p>
                <p style={{ color: 'var(--text-primary)' }}>
                  {new Date(room.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {room.type === 'GROUP' && (
            <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Thành viên ({room.participant_count || 0})
              </h4>
              {/* Add members list here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;

