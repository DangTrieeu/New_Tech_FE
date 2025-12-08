import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Chào mừng đến với Studio478
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nền tảng nhắn tin hiện đại, kết nối mọi người một cách đơn giản và hiệu quả.
            Trò chuyện, chia sẻ và giao tiếp không giới hạn.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Bắt đầu ngay
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-3 bg-white text-gray-700 text-lg rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-md"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Nhắn tin nhanh</h3>
            <p className="text-gray-600">
              Gửi và nhận tin nhắn tức thì với giao diện thân thiện và dễ sử dụng
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quản lý danh bạ</h3>
            <p className="text-gray-600">
              Lưu trữ và tìm kiếm danh bạ dễ dàng, luôn kết nối với bạn bè
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Bảo mật cao</h3>
            <p className="text-gray-600">
              Thông tin của bạn được bảo vệ với công nghệ mã hóa hiện đại
            </p>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Khám phá Studio478
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/chat')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                💬 Trang Chat
              </h4>
              <p className="text-gray-600 text-sm">
                Xem giao diện chat và trải nghiệm tính năng nhắn tin
              </p>
            </button>

            <button
              onClick={() => navigate('/contacts')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600">
                📱 Danh bạ
              </h4>
              <p className="text-gray-600 text-sm">
                Quản lý và tìm kiếm liên hệ của bạn
              </p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600">
                👤 Trang cá nhân
              </h4>
              <p className="text-gray-600 text-sm">
                Xem và chỉnh sửa thông tin cá nhân của bạn
              </p>
            </button>

            <button
              onClick={() => navigate('/about')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600">
                ℹ️ Giới thiệu
              </h4>
              <p className="text-gray-600 text-sm">
                Tìm hiểu thêm về Studio478 và dịch vụ
              </p>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">&copy; 2025 Studio478. All rights reserved.</p>
            <p className="text-sm">
              Liên hệ: contact@studio478.com | +84 123 456 789
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;

