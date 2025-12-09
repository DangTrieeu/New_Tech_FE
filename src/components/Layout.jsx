import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import logo from '../assets/logo.png';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Check if user is logged in (giả lập, sau này sẽ connect với authentication)
  const isAuthenticated = location.pathname !== '/' && location.pathname !== '/welcome' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/about';

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'var(--surface-color)', boxShadow: `0 1px 3px var(--shadow)` }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img className="w-20 h-20" src={logo} alt="Chat App Logo"/>
                <span className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>Chat App</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/chat'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/chat' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/chat' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Tin nhắn
                  </Link>
                  <Link
                    to="/contacts"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/contacts'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/contacts' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/contacts' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Danh bạ
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/profile'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/profile' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/profile' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Cá nhân
                  </Link>
                  <Link
                    to="/about"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/about'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/about' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/about' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Giới thiệu
                  </Link>
                  {/* Nút chuyển đổi Theme */}
                  <button
                    onClick={toggleTheme}
                    className="ml-2 px-3 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
                    title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
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
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/' || location.pathname === '/welcome'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => !(location.pathname === '/' || location.pathname === '/welcome') && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => !(location.pathname === '/' || location.pathname === '/welcome') && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/about"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/about'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/about' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/about' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Giới thiệu
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg transition-colors`}
                    style={location.pathname === '/login'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => location.pathname !== '/login' && (e.currentTarget.style.backgroundColor = 'var(--hover-color)')}
                    onMouseLeave={(e) => location.pathname !== '/login' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Đăng nhập
                  </Link>
                  {/* Nút chuyển đổi Theme */}
                  <button
                    onClick={toggleTheme}
                    className="px-3 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
                    title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
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
                className="hover:text-blue-600 focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
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
          <div className="md:hidden" style={{ borderTop: `1px solid var(--border-color)` }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/chat'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Tin nhắn
                  </Link>
                  <Link
                    to="/contacts"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/contacts'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Danh bạ
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/profile'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Cá nhân
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/about'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Giới thiệu
                  </Link>
                  {/* Nút chuyển đổi Theme cho Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="block w-full text-left px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
                  >
                    {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
                  </button>
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
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/' || location.pathname === '/welcome'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/about'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Giới thiệu
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg`}
                    style={location.pathname === '/login'
                      ? { backgroundColor: 'var(--primary-color)', color: 'white' }
                      : { color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  >
                    Đăng nhập
                  </Link>
                  {/* Nút chuyển đổi Theme cho Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="block w-full text-left px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
                  >
                    {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
                  </button>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-blue-700"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
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
