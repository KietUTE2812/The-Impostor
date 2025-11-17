# Word Impostor - Social Deduction Game

Một game online suy luận xã hội theo lượt, nơi người chơi đưa ra các từ liên quan đến một Từ Khóa, trong khi Kẻ Giả Mạo (chỉ biết Chủ Đề) cố gắng trà trộn.

## 📁 Cấu trúc Dự án

```
Imposter/
├── backend/               # Node.js + Express + Socket.IO
│   ├── config/           # Cấu hình database
│   ├── models/           # MongoDB models
│   ├── game/             # Logic game (GameManager)
│   ├── scripts/          # Scripts seed database
│   ├── server.js         # Entry point
│   └── package.json
│
├── frontend/             # Next.js + React + TypeScript
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── contexts/        # React contexts (GameContext)
│   └── package.json
│
├── project_architect.md  # Tài liệu kiến trúc
└── rule_of_game.md      # Luật chơi
```

## 🚀 Hướng dẫn Cài đặt

### Yêu cầu

- Node.js >= 18.x
- MongoDB >= 6.x
- npm hoặc yarn

### 1. Cài đặt Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env với MongoDB URI của bạn
# MONGODB_URI=mongodb://localhost:27017/word-impostor
```

### 2. Cài đặt Frontend

```bash
cd frontend
npm install

# File .env.local đã được tạo sẵn
```

### 3. Khởi chạy MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn:

```bash
# Windows
mongod

# hoặc nếu đã cài MongoDB service
net start MongoDB
```

### 4. Seed Database (Tạo dữ liệu mẫu)

```bash
cd backend
node scripts/seedDatabase.js
```

## 🎮 Chạy Ứng dụng

### Development Mode

Mở 2 terminal:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy tại http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App chạy tại http://localhost:3000
```

### Production Mode

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🎯 Cách Chơi

1. **Tạo phòng** hoặc **Tham gia phòng** với Room ID
2. Cần **4-8 người chơi** để bắt đầu
3. Host nhấn **Start Game**
4. Hệ thống phân vai:
   - **Crewmates**: Biết Category và Keyword
   - **Impostor**: Chỉ biết Category
5. Mỗi người lần lượt nói **1 từ** liên quan đến Keyword (3 rounds)
6. **Vote** ai là Impostor
7. Crewmates thắng nếu vote đúng Impostor!

## 🛠️ Công nghệ Sử dụng

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - WebSocket client

## 📝 API Events (Socket.IO)

### Client to Server (C2S)

| Event | Payload | Mô tả |
|-------|---------|-------|
| `createRoom` | `{ username }` | Tạo phòng mới |
| `joinRoom` | `{ username, roomId }` | Tham gia phòng |
| `startGame` | `{ roomId }` | Bắt đầu game |
| `submitWord` | `{ roomId, word }` | Gửi từ |
| `castVote` | `{ roomId, votedPlayerId }` | Vote người chơi |
| `playAgain` | `{ roomId }` | Chơi lại |

### Server to Client (S2C)

| Event | Payload | Mô tả |
|-------|---------|-------|
| `roomCreated` | `{ roomId, players }` | Phòng được tạo |
| `joinedRoom` | `{ roomId, players }` | Đã tham gia phòng |
| `roomUpdate` | `{ players }` | Cập nhật danh sách người chơi |
| `gameStart` | `{ role, category, keyword? }` | Game bắt đầu (gửi riêng) |
| `nextTurn` | `{ playerId, username, round }` | Lượt tiếp theo |
| `wordSubmitted` | `{ wordHistory }` | Từ đã gửi |
| `startVoting` | `{ wordHistory }` | Bắt đầu vote |
| `gameResult` | `{ votedOutPlayer, winner, ... }` | Kết quả |

## 🔒 Bảo mật

- **Server-Authoritative**: Mọi logic game được xử lý trên server
- **Private Information**: Vai trò và keyword được gửi riêng cho từng client
- **Validation**: Server validate mọi action từ client

## 📚 Tài liệu Tham khảo

- [project_architect.md](./project_architect.md) - Kiến trúc chi tiết
- [rule_of_game.md](./rule_of_game.md) - Luật chơi chi tiết

## 🐛 Troubleshooting

**MongoDB Connection Error:**
```bash
# Kiểm tra MongoDB đang chạy
mongosh
# hoặc
mongo
```

**Port đã được sử dụng:**
```bash
# Thay đổi PORT trong .env (backend)
PORT=3002

# Thay đổi NEXT_PUBLIC_SOCKET_URL (frontend/.env.local)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
```

## 📄 License

MIT

---

**Enjoy the game! 🎉**
