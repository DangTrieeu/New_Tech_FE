# Backend API Requirements for Message Pagination

## 📋 Overview

Frontend đã được implement với **infinite scroll pagination** để load tin nhắn từng phần (5 tin nhắn mỗi lần). Backend cần cung cấp API endpoint với cấu trúc response phù hợp.

## 🎯 API Endpoint

```
GET /api/messages/:roomId?page=1&limit=5
```

### Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `roomId` | number | required | ID của phòng chat |
| `page` | number | 1 | Số trang (bắt đầu từ 1) |
| `limit` | number | 5 | Số lượng tin nhắn mỗi trang |

## 📤 Response Structure

Backend **BẮT BUỘC** phải trả về theo cấu trúc sau:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "room_id": 123,
      "user_id": 456,
      "content": "Nội dung tin nhắn",
      "type": "TEXT",
      "created_at": "2025-01-25T10:30:00.000Z",
      "updated_at": "2025-01-25T10:30:00.000Z",
      "is_recalled": false,
      "recalled_at": null,
      "reply_to_message_id": null,
      "user": {
        "id": 456,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "replyToMessage": null
    }
    // ... 4 more messages
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalMessages": 50,
    "limit": 5,
    "hasMore": true  // ⚠️ QUAN TRỌNG: Frontend dùng field này để biết còn tin nhắn không
  }
}
```

## ⚠️ Quan trọng: Thứ tự sắp xếp

Backend có thể trả về messages theo 2 cách:

### ✅ Option 1: Sort DESC (Recommended)
```sql
ORDER BY created_at DESC
```
- Tin nhắn **mới nhất** trước
- Page 1: 5 tin nhắn mới nhất
- Page 2: 5 tin nhắn tiếp theo (cũ hơn)

### ✅ Option 2: Sort ASC
```sql
ORDER BY created_at ASC
```
- Tin nhắn **cũ nhất** trước
- Page 1: 5 tin nhắn cũ nhất
- Page 2: 5 tin nhắn tiếp theo (mới hơn)

> **Lưu ý**: Frontend sẽ tự động sort lại theo chronological order (cũ → mới) sau khi nhận data, nên backend có thể dùng cách nào cũng được.

## 🔧 Backend Implementation Example (Node.js + Sequelize)

### Controller

```javascript
// messageController.js
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // Count total messages
    const totalMessages = await Message.count({
      where: { room_id: roomId }
    });

    // Get paginated messages
    const messages = await Message.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Message,
          as: 'replyToMessage',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }]
        }
      ],
      order: [['created_at', 'DESC']], // Mới nhất trước
      limit,
      offset
    });

    const totalPages = Math.ceil(totalMessages / limit);
    const hasMore = page < totalPages;

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        limit,
        hasMore // ⚠️ Quan trọng!
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải tin nhắn'
    });
  }
};
```

## 🧪 Test Cases

### Test 1: Lấy trang đầu tiên
```bash
GET /api/messages/123?page=1&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [/* 5 messages */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalMessages": 50,
    "limit": 5,
    "hasMore": true
  }
}
```

### Test 2: Lấy trang giữa
```bash
GET /api/messages/123?page=5&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [/* 5 messages */],
  "pagination": {
    "currentPage": 5,
    "totalPages": 10,
    "totalMessages": 50,
    "limit": 5,
    "hasMore": true
  }
}
```

### Test 3: Lấy trang cuối cùng
```bash
GET /api/messages/123?page=10&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [/* 5 messages */],
  "pagination": {
    "currentPage": 10,
    "totalPages": 10,
    "totalMessages": 50,
    "limit": 5,
    "hasMore": false  // ⚠️ Không còn tin nhắn nữa
  }
}
```

### Test 4: Phòng có ít hơn 5 tin nhắn
```bash
GET /api/messages/456?page=1&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [/* 3 messages */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalMessages": 3,
    "limit": 5,
    "hasMore": false
  }
}
```

### Test 5: Phòng không có tin nhắn
```bash
GET /api/messages/789?page=1&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 0,
    "totalMessages": 0,
    "limit": 5,
    "hasMore": false
  }
}
```

## 🎨 Frontend Behavior

### Cách hoạt động:
1. **Mở phòng chat**: Load 5 tin nhắn mới nhất (page 1)
2. **User scroll lên đầu**: Tự động load thêm 5 tin nhắn (page 2, 3, ...)
3. **Khi `hasMore = false`**: Dừng load, không gọi API nữa

### Infinite Scroll với IntersectionObserver:
```javascript
// Frontend sử dụng IntersectionObserver
// Khi user scroll gần đến đỉnh (top) của chat list
// → Tự động gọi API load thêm tin nhắn
// → Không làm gián đoạn trải nghiệm đọc tin nhắn
```

## 🚀 Performance Tips

### 1. Database Indexing
```sql
CREATE INDEX idx_messages_room_created 
ON messages(room_id, created_at DESC);
```

### 2. Eager Loading
- Luôn include `user` và `replyToMessage` để tránh N+1 query
- Frontend cần data này để hiển thị tên người gửi và preview reply

### 3. Caching (Optional)
- Cache page 1 (5 tin nhắn mới nhất) với Redis
- TTL: 60 seconds
- Invalidate khi có tin nhắn mới

### 4. Limit Range
```javascript
const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
// Min: 1, Max: 50, Default: 5
```

## 📝 Checklist Implementation

Backend developer cần implement:

- [ ] API endpoint `/api/messages/:roomId`
- [ ] Hỗ trợ query params `page` và `limit`
- [ ] Trả về đúng structure với `pagination.hasMore`
- [ ] Include quan hệ `user` và `replyToMessage`
- [ ] Sort theo `created_at DESC` hoặc `ASC`
- [ ] Handle edge cases (phòng trống, page vượt quá)
- [ ] Add database index cho performance
- [ ] Test với Postman/curl
- [ ] Log để debug nếu có lỗi

## 🐛 Common Issues

### Issue 1: Frontend không load thêm tin nhắn
**Nguyên nhân**: Backend không trả về `pagination.hasMore`

**Fix**: Đảm bảo response có field này:
```javascript
hasMore: page < totalPages
```

### Issue 2: Tin nhắn bị duplicate
**Nguyên nhân**: Backend không consistent về thứ tự sort

**Fix**: Luôn dùng `ORDER BY created_at DESC` và `created_at ASC` làm secondary sort:
```sql
ORDER BY created_at DESC, id DESC
```

### Issue 3: Page không tồn tại
**Request**: `page=999` nhưng chỉ có 10 pages

**Fix**: Trả về empty array, không throw error:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 999,
    "totalPages": 10,
    "totalMessages": 50,
    "limit": 5,
    "hasMore": false
  }
}
```

## 📞 Support

Nếu có vấn đề trong implementation, check:
1. Console log response structure
2. Network tab trong DevTools
3. Backend logs
4. Database query execution time

---

**Tóm tắt**: Backend chỉ cần trả về đúng structure với `pagination.hasMore`, frontend sẽ tự động xử lý phần còn lại! 🎉

