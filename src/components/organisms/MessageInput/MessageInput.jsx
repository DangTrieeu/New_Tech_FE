import React from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

const MessageInput = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <div className="p-4 border-t" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <button type="button" className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
          <Paperclip className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500" style={{ color: 'var(--text-secondary)' }}>
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-lg outline-none"
          style={{
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}
        />
        <button
          type="submit"
          disabled={disabled}
          className="p-2 rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

