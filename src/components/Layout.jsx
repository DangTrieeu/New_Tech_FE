import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if user is logged in (giả lập, sau này sẽ connect với authentication)
  const isAuthenticated = location.pathname !== '/' && location.pathname !== '/welcome' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/about';

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-blue-600">Studio478</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/chat'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    💬 Tin nhắn
                  </Link>
                  <Link
                    to="/contacts"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/contacts'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📱 Danh bạ
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 Cá nhân
                  </Link>
                  <Link
                    to="/about"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/about'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ℹ️ Giới thiệu
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/' || location.pathname === '/welcome'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🏠 Trang chủ
                  </Link>
                  <Link
                    to="/about"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/about'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ℹ️ Giới thiệu
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/login'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/chat'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    💬 Tin nhắn
                  </Link>
                  <Link
                    to="/contacts"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/contacts'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📱 Danh bạ
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/profile'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 Cá nhân
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/about'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ℹ️ Giới thiệu
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/' || location.pathname === '/welcome'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🏠 Trang chủ
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/about'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ℹ️ Giới thiệu
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === '/login'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}

export default Layout;

