import React from 'react';
import {
  shouldGroupMessages,
  shouldShowDateSeparator,
  formatDateSeparator,
  formatMessageTime,
} from '@/utils/dateUtils';

const MessageList = ({ messages, currentUserId, loading, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: 'var(--text-secondary)' }}>Chưa có tin nhắn nào</p>
      </div>
    );
  }

  return (
    <div>
      {messages.map((msg, index) => {
        const isOwn = msg.sender_id === currentUserId;
        const previousMsg = index > 0 ? messages[index - 1] : null;
        const shouldGroup = shouldGroupMessages(msg, previousMsg);
        const showDateSeparator = shouldShowDateSeparator(msg, previousMsg);

        return (
          <React.Fragment key={msg.id}>
            {/* Date Separator - Show after 6 hours gap */}
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <div className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--text-secondary)'
                  }}>
                  {formatDateSeparator(msg.created_at)}
                </div>
              </div>
            )}

            {/* Message */}
            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${shouldGroup ? 'mb-1' : 'mb-3 mt-3'}`}>
              <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Show sender name only if not grouped and not own message */}
                {!isOwn && !shouldGroup && (
                  <p className="text-xs mb-1 px-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {msg.sender?.name || 'Unknown'}
                  </p>
                )}

                {/* Message bubble */}
                <div
                  className={`px-4 py-2 ${shouldGroup ? 'rounded-2xl' : (isOwn ? 'rounded-2xl' : 'rounded-2xl')}`}
                  style={{
                    backgroundColor: isOwn ? 'var(--primary-color)' : 'var(--surface-color)',
                    color: isOwn ? '#fff' : 'var(--text-primary)',
                    opacity: msg.status === 'sending' ? 0.7 : 1,
                  }}
                >
                  <p className="break-words">{msg.content}</p>
                </div>

                {/* Show time only if not grouped with next message */}
                {(() => {
                  const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
                  const groupedWithNext = nextMsg && shouldGroupMessages(nextMsg, msg, currentUserId);

                  if (!groupedWithNext) {
                    return (
                      <p className="text-xs mt-1 px-2" style={{ color: 'var(--text-secondary)' }}>
                        {formatMessageTime(msg.created_at)}
                        {msg.status === 'sending' && ' • Đang gửi...'}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

