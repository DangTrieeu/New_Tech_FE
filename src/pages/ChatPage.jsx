import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Xin chào!', time: '10:30' },
    { id: 2, sender: 'me', text: 'Chào bạn!', time: '10:31' },
    { id: 3, sender: 'other', text: 'Bạn khỏe không?', time: '10:32' },
  ]);
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        text: message,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Tin nhắn</h2>
        </div>

        <div className="overflow-y-auto">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  U{item}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">User {item}</h3>
                  <p className="text-sm text-gray-500 truncate">Tin nhắn mới nhất...</p>
                </div>
                <span className="text-xs text-gray-400">10:00</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              U1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">User 1</h3>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-xs ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
