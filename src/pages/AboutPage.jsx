import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            ← Quay lại
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Giới thiệu
          </h1>
          <div className="w-10"></div>
        </div>

        {/* About Content */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Chat App
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Phiên bản 1.0.0
            </p>
          </div>

          <div className="space-y-4" style={{ color: 'var(--text-primary)' }}>
            <div>
              <h3 className="font-semibold mb-2">Về ứng dụng</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Chat App là ứng dụng nhắn tin hiện đại, giúp bạn kết nối với bạn bè và gia đình một cách dễ dàng.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tính năng</h3>
              <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>Nhắn tin thời gian thực</li>
                <li>Gọi thoại và video</li>
                <li>Chia sẻ hình ảnh, video</li>
                <li>Tạo nhóm chat</li>
                <li>Mã hóa đầu cuối</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Liên hệ</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Email: support@chatapp.com<br />
                Website: www.chatapp.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

