import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', { email, password });
    // Sau khi đăng nhập thành công, chuyển đến trang chat
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Studio478</h1>
          <p className="text-gray-600">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/about" className="text-sm text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
          <Link to="/register" className="text-sm text-blue-600 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
