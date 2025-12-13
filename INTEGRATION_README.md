# Chat App Frontend

## 🚀 Tính năng

### ✅ Đã triển khai

#### Authentication & User Management
- ✅ Đăng ký tài khoản (email + password)
- ✅ Đăng nhập
- ✅ Đăng xuất
- ✅ Tự động refresh token khi hết hạn
- ✅ Protected routes (redirect về login nếu chưa đăng nhập)
- ✅ Xem và chỉnh sửa profile (tên, avatar)
- ✅ Đổi mật khẩu (chỉ cho local auth)
- ✅ Tìm kiếm người dùng

#### Chat Features
- ✅ Giao diện 3 cột giống Zalo:
  - Trái: Danh sách chat + Search + Settings
  - Giữa: Màn hình chat
  - Phải: Thông tin phòng chat/người dùng
- ✅ Realtime chat với Socket.IO
- ✅ Tạo phòng chat 1-1
- ✅ Hiển thị lịch sử tin nhắn
- ✅ Gửi tin nhắn text
- ✅ Hiển thị trạng thái online/offline
- ✅ Dark mode / Light mode

## 📁 Cấu trúc thư mục

```
src/
├── api/
│   └── axios.js              # Axios instance với interceptors
├── config/
│   └── api.js                # API endpoints configuration
├── services/
│   ├── authService.js        # Authentication APIs
│   ├── userService.js        # User management APIs
│   ├── roomService.js        # Room/Chat APIs
│   └── messageService.js     # Message APIs
├── contexts/
│   ├── AuthContext.jsx       # Auth state management
│   ├── SocketContext.jsx     # Socket.IO connection
│   └── ThemeContext.jsx      # Dark/Light mode
├── components/
│   ├── ProtectedRoute.jsx    # Route protection
│   ├── atoms/                # Atomic components
│   ├── molecules/
│   │   ├── EditProfileModal/
│   │   └── ChangePasswordModal/
│   └── organisms/
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ChatPage.jsx          # Main chat interface (Zalo-like)
│   ├── ProfilePage.jsx
│   ├── ContactsPage.jsx
│   ├── AboutPage.jsx
│   └── WelcomePage.jsx
└── hooks/
    └── useTheme.js
```

## 🛠️ Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Backend URL

File `.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Chạy development server
```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:3000`

## 🔌 Backend APIs đã tích hợp

### Authentication (`/auth`)
- `POST /auth/` - Đăng nhập
- `POST /users/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh-token` - Refresh access token

### User Management (`/users`)
- `GET /users/profile` - Lấy thông tin user hiện tại
- `PUT /users/profile` - Cập nhật profile (name, avatar_url)
- `PUT /users/change-password` - Đổi mật khẩu
- `GET /users/search?q=keyword` - Tìm kiếm user
- `GET /users/:id` - Lấy thông tin user theo ID

### Rooms (`/api/rooms`)
- `GET /api/rooms/` - Lấy danh sách phòng chat
- `POST /api/rooms/private` - Tạo/lấy phòng chat 1-1
- `POST /api/rooms/group` - Tạo nhóm chat

### Messages (`/api/messages`)
- `GET /api/messages/:roomId?page=1&limit=20` - Lấy lịch sử tin nhắn
- `POST /api/messages/upload` - Upload file

### Socket.IO Events
- `join_room` - Tham gia phòng chat
- `leave_room` - Rời phòng chat
- `send_message` - Gửi tin nhắn
- `receive_message` - Nhận tin nhắn mới
- `delete_message` - Xóa tin nhắn
- `message_deleted` - Thông báo tin nhắn bị xóa
- `user_typing` - Thông báo đang gõ

## 📝 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản
- Truy cập `/register`
- Nhập: Tên, Email, Password (tối thiểu 6 ký tự)
- Click "Đăng ký"

### 2. Đăng nhập
- Truy cập `/login`
- Nhập Email và Password
- Click "Đăng nhập"
- Tự động chuyển về `/chat` sau khi đăng nhập thành công

### 3. Tìm kiếm và chat với người dùng
- Ở ChatPage, nhập tên/email vào thanh tìm kiếm
- Click vào user -> Tự động tạo phòng chat 1-1
- Gửi tin nhắn

### 4. Chỉnh sửa profile
- Click vào icon ⚙️ (Settings) ở góc trên bên trái
- Chọn "Cá nhân"
- Click "Chỉnh sửa hồ sơ"
- Cập nhật tên hoặc avatar URL

### 5. Đổi mật khẩu
- Vào trang Profile
- Click "Đổi mật khẩu"
- Nhập mật khẩu cũ và mật khẩu mới

### 6. Đăng xuất
- Click vào icon ⚙️ (Settings)
- Chọn "Đăng xuất"

## 🎨 Features nổi bật

### Auto Refresh Token
- Khi access token hết hạn (401), tự động gọi API refresh token
- Retry lại request ban đầu với token mới
- Nếu refresh token hết hạn -> Đăng xuất và redirect về login

### Protected Routes
- Tất cả route `/chat`, `/profile`, `/contacts`, `/about` đều được bảo vệ
- Phải đăng nhập mới truy cập được
- Tự động redirect về `/login` nếu chưa auth

### Realtime Chat
- Socket.IO tự động connect khi đăng nhập
- Tự động disconnect khi đăng xuất
- Nhận tin nhắn realtime không cần reload

### Dark Mode
- Toggle giữa Light/Dark mode
- Lưu preference vào localStorage
- Tự động apply theme khi reload

### Toast Notifications
- Hiển thị thông báo cho tất cả actions:
  - Đăng nhập/đăng ký thành công/thất bại
  - Cập nhật profile
  - Đổi mật khẩu
  - Lỗi từ API

## 🔧 Các thư viện sử dụng

- **React 19** - UI Framework
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Socket.IO Client** - Realtime communication
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### 1. CORS Error
Đảm bảo backend cho phép CORS từ `http://localhost:3000`

### 2. Socket connection failed
- Kiểm tra backend có chạy không
- Kiểm tra URL trong `.env` đúng chưa
- Kiểm tra token có hợp lệ không

### 3. 401 Unauthorized
- Token hết hạn -> Tự động refresh
- Nếu vẫn lỗi -> Đăng xuất và đăng nhập lại

### 4. Vite không nhận biến môi trường
- Biến môi trường phải bắt đầu bằng `VITE_`
- Restart dev server sau khi thay đổi `.env`

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Axios Documentation](https://axios-http.com)
- [React Router](https://reactrouter.com)

## 👨‍💻 Developer Notes

### Cách thêm API mới

1. Thêm endpoint vào `src/config/api.js`
2. Tạo function trong service tương ứng
3. Gọi từ component/page

### Cách thêm Socket event mới

1. Thêm emit/on function vào `SocketContext.jsx`
2. Sử dụng `useSocket()` hook trong component

### Cách tạo Protected Route mới

```jsx
<Route
  path="/new-route"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

## 🎯 Roadmap / TODO

- [ ] Upload avatar (Cloudinary integration)
- [ ] Gửi file/hình ảnh trong chat
- [ ] Emoji picker
- [ ] Group chat management (add/remove members)
- [ ] Typing indicator
- [ ] Message reactions
- [ ] Message search
- [ ] Voice/Video call
- [ ] Notification system
- [ ] Read receipts
- [ ] Message pagination (lazy load)
- [ ] Online users list
- [ ] User presence (last seen)
- [ ] Forgot password
- [ ] Email verification
- [ ] OAuth (Google, GitHub)

---

**Built with ❤️ using React + Vite**

