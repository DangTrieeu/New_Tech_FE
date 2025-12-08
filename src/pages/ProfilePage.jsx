import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    bio: 'Xin chào, tôi là người dùng Studio478',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Save profile changes
    setIsEditing(false);
    console.log('Saved profile:', profile);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Trang cá nhân</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
              {profile.name.charAt(0)}
            </div>
            <button className="text-blue-600 hover:underline">
              Thay đổi ảnh đại diện
            </button>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới thiệu
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Additional Settings */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Cài đặt</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Đổi mật khẩu
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Cài đặt quyền riêng tư
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
