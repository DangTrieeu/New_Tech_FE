import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getSmartReply } from '@/services/aiService';
import toast from 'react-hot-toast';

const SmartReplyButton = ({ messageId, onSelectReply }) => {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const handleGetReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    try {
      setLoading(true);
      const response = await getSmartReply(messageId);
      const suggestions = response.data?.suggestions || response.suggestions || [];
      setReplies(suggestions);
      setShowReplies(true);
    } catch (error) {
      console.error('Smart reply error:', error);
      toast.error('Không thể tạo gợi ý trả lời');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReply = (reply) => {
    onSelectReply(reply);
    setShowReplies(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleGetReplies}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
        style={{ color: 'var(--primary-color)' }}
        title="Gợi ý trả lời"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Sparkles className="w-3 h-3" />
        )}
        <span>Gợi ý</span>
      </button>

      {showReplies && replies.length > 0 && (
        <div
          className="absolute bottom-full mb-2 left-0 rounded-lg shadow-lg p-2 z-10 min-w-[250px] max-w-[350px]"
          style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}
        >
          <div className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--text-secondary)' }}>
            Chọn câu trả lời:
          </div>
          <div className="space-y-1">
            {replies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSelectReply(reply)}
                className="w-full text-left px-3 py-2 rounded text-sm hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartReplyButton;

