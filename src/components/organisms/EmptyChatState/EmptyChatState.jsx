import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="text-center">
        <MessageCircle className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Chọn một cuộc trò chuyện để bắt đầu
        </p>
      </div>
    </div>
  );
};

export default EmptyChatState;
