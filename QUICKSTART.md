# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy Word Impostor Game trong 5 phút!

## ⚡ Bước 1: Cài đặt Dependencies

### Backend
```powershell
cd backend
npm install
```

### Frontend
```powershell
cd frontend
npm install
```

## ⚙️ Bước 2: Cấu hình Environment

### Backend - Tạo `.env`
```powershell
cd backend
New-Item -Path ".env" -ItemType File
```

Thêm vào file `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/word-impostor
PORT=3001
```

### Frontend - Tạo `.env.local`
```powershell
cd frontend
New-Item -Path ".env.local" -ItemType File
```

Thêm vào file `.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🗄️ Bước 3: Setup MongoDB & Seed Data

### Chạy MongoDB
```powershell
# Nếu đã cài MongoDB local
mongod

# HOẶC sử dụng MongoDB Atlas (cloud) - miễn phí
# Truy cập: https://www.mongodb.com/cloud/atlas
# Lấy connection string và update vào backend/.env
```

### Seed Database
```powershell
cd backend
node scripts/seedDatabase.js
```

Kết quả:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Seeded 8 categories with 64 keywords
✓ Database seeding completed!
```

## ▶️ Bước 4: Chạy Application

Mở **2 terminal**:

### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```

Thấy:
```
✓ MongoDB connected!
✓ Server running on port 3001
✓ Socket.IO ready
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

Thấy:
```
✓ Ready on http://localhost:3000
```

## 🎮 Bước 5: Chơi Game!

1. Mở trình duyệt: `http://localhost:3000`
2. Nhập tên của bạn
3. Click **CREATE NEW GAME** hoặc join room code
4. Chờ 4 người chơi (test bằng 4 tabs khác nhau)
5. Host click **START GAME**
6. Enjoy! 🎉

## 🔍 Kiểm tra Nhanh

### Backend hoạt động?
```powershell
curl http://localhost:3001
# Kết quả: Cannot GET / (OK - server đang chạy)
```

### MongoDB connected?
```powershell
# Check logs trong terminal backend
# Tìm dòng: "MongoDB connected!"
```

### Frontend build OK?
```powershell
# Check logs trong terminal frontend
# Tìm dòng: "✓ Compiled successfully"
```

## ❌ Lỗi thường gặp

### Port đã bị sử dụng
```powershell
# Xem process chiếm port
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng số thực)
taskkill /PID <PID> /F
```

### MongoDB không connect
```powershell
# Kiểm tra MongoDB service
mongod --version

# Start MongoDB service
net start MongoDB

# Hoặc dùng MongoDB Atlas (cloud)
```

### Socket.IO không connect
- Kiểm tra backend đang chạy: `http://localhost:3001`
- Kiểm tra `.env.local` có đúng URL: `http://localhost:3001`
- Restart cả backend và frontend

## 📱 Test Multiplayer Local

**Cách 1: Nhiều tabs cùng trình duyệt**
1. Mở 4 tabs `http://localhost:3000`
2. Nhập tên khác nhau mỗi tab
3. Tab 1: Create room → Copy code
4. Tab 2,3,4: Join với code đó

**Cách 2: Nhiều trình duyệt**
- Chrome, Firefox, Edge, Safari
- Mỗi trình duyệt = 1 người chơi

**Cách 3: Test với điện thoại**
1. Tìm IP máy tính: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Ví dụ: `192.168.1.100`
3. Trên điện thoại truy cập: `http://192.168.1.100:3000`
4. Join cùng room code

## 🎯 Flow Test Nhanh

```
1. Tab 1 (Host):
   - Nhập tên "Alice"
   - Create Room
   - Copy code (ví dụ: ABC123)

2. Tab 2,3,4 (Players):
   - Nhập tên "Bob", "Carol", "David"
   - Join room "ABC123"

3. Tab 1 (Host):
   - Thấy 4 players ready
   - Click START GAME

4. Tất cả tabs:
   - Thấy role (Crewmate hoặc Impostor)
   - Thấy category và keyword (nếu Crewmate)
   - Chơi 3 rounds
   - Vote
   - Xem kết quả
```

## 📚 Tài liệu chi tiết

- [README.md](./README.md) - Full documentation
- [project_architect.md](./project_architect.md) - Kiến trúc hệ thống
- [rule_of_game.md](./rule_of_game.md) - Luật chơi chi tiết

---

**Happy Gaming! 🎮🎭✨**
