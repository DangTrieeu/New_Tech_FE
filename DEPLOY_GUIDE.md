# 🚀 Hướng Dẫn Deploy Frontend

## ⚙️ Cấu Hình Biến Môi Trường

### **Development (Local)**
File: `.env`
```
VITE_BACKEND_URL=http://localhost:5000
```

### **Production (Deploy)**

#### **Cách 1: Sử dụng .env.production (Recommended)**
File: `.env.production`
```
VITE_BACKEND_URL=https://your-backend-api.onrender.com
```

**Lưu ý:** Khi build với `npm run build`, Vite tự động dùng file `.env.production`

---

#### **Cách 2: Set biến môi trường trên platform**

##### **Vercel:**
```bash
Dashboard → Settings → Environment Variables
Key: VITE_BACKEND_URL
Value: https://your-backend-api.onrender.com
```

##### **Netlify:**
```bash
Site settings → Environment → Environment variables
Key: VITE_BACKEND_URL
Value: https://your-backend-api.onrender.com
```

##### **Railway:**
```bash
Variables tab
VITE_BACKEND_URL=https://your-backend-api.onrender.com
```

---

## 📝 Các Bước Deploy

### **1. Cập nhật URL Backend**
Sửa file `.env.production`:
```
VITE_BACKEND_URL=https://your-actual-backend-url.com
```

### **2. Build Project**
```bash
npm run build
```

### **3. Test Build Locally**
```bash
npm run preview
```

### **4. Deploy**

#### **Deploy lên Vercel:**
```bash
npm install -g vercel
vercel
```

#### **Deploy lên Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### **Deploy lên Railway:**
- Connect GitHub repo
- Set environment variables
- Deploy automatically

---

## ✅ Checklist Deploy

- [ ] Đã cập nhật `VITE_BACKEND_URL` trong `.env.production`
- [ ] Backend đã deploy và có URL public
- [ ] CORS trên backend cho phép frontend URL
- [ ] Test API từ frontend production
- [ ] Google OAuth callback URL đã cập nhật (nếu dùng)

---

## 🔍 Kiểm Tra URL Đang Dùng

Thêm dòng này vào `main.jsx` để debug:
```javascript
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
```

---

## 🐛 Troubleshooting

**Lỗi: Vẫn gọi localhost sau khi deploy**
- ✅ Xóa cache browser: `Ctrl + Shift + R`
- ✅ Kiểm tra biến môi trường trên hosting platform
- ✅ Rebuild lại project: `npm run build`

**Lỗi: CORS**
- ✅ Thêm frontend URL vào `FRONTEND_URL` trong backend `.env`
- ✅ Restart backend service

**Lỗi: 404 Not Found**
- ✅ Kiểm tra backend URL có đúng không
- ✅ Kiểm tra backend đã chạy chưa
- ✅ Test backend API bằng Postman

---

## 📂 Cấu Trúc Files

```
New_Tech_FE/
├── .env                    # Development (localhost)
├── .env.production         # Production (deploy)
└── src/
    └── config/
        └── api.js          # API_BASE_URL config
```

---

## 🌐 Example URLs

**Development:**
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

**Production:**
```
Frontend: https://your-app.vercel.app
Backend:  https://your-api.onrender.com
```
