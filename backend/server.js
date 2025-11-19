const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = require('./config/database');
connectDB();

// Game state management
const gameInstances = {}; // { roomId: gameState }
let totalPlayers = 0;
// Import game logic
const GameManager = require('./game/GameManager');

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.join(socket.id); // Join a room with the socket ID
  totalPlayers++;

  // Update global stats whenever a new client connects
  updateGlobalStats();

  // Create Room
  socket.on('createRoom', ({ username }) => {
    const roomId = generateRoomId();
    const gameManager = new GameManager(roomId, io);
    gameInstances[roomId] = gameManager;
    
    socket.join(roomId);
    gameManager.addPlayer(socket.id, username, true); // true = host
    
    socket.emit('roomCreated', { roomId, players: gameManager.getPlayers() });
    updateGlobalStats();
    console.log(`Room ${roomId} created by ${username}`);
  });

  // Join Room
  socket.on('joinRoom', ({ username, roomId }) => {
    const gameManager = gameInstances[roomId];
    
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (gameManager.gameState !== 'LOBBY') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    if (gameManager.players.length >= 8) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (gameManager.players.some(p => p.username === username)) {
      socket.emit('error', { message: 'Username already taken in this room' });
      return;
    }

    socket.join(roomId);
    gameManager.addPlayer(socket.id, username, false);
    
    socket.emit('joinedRoom', { roomId, players: gameManager.getPlayers() });
    io.in(roomId).emit('roomUpdate', { players: gameManager.getPlayers() });
    console.log(`${username} joined room ${roomId}`);
  });

  // Leave Room
  socket.on('leaveRoom', ({ roomId }) => {
    const gameManager = gameInstances[roomId];
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    gameManager.removePlayer(socket.id);
    socket.leave(roomId);
    console.log(`Player ${socket.id} left room ${roomId}`);
    // If room is empty, delete it
    if (gameManager.players.length === 0) {
      delete gameInstances[roomId];
      console.log(`Room ${roomId} deleted (empty)`);
    }
    updateGlobalStats();
  });

  // Start Game
  socket.on('startGame', ({ roomId }) => {
    console.log('Starting game in room:', roomId);
    const gameManager = gameInstances[roomId];
    
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (!gameManager.isHost(socket.id)) {
      socket.emit('error', { message: 'Only host can start the game' });
      return;
    }

    if (gameManager.players.length < 4) {
      socket.emit('error', { message: 'Need at least 4 players to start' });
      return;
    }

    console.log('Game starting for room:', roomId);
    gameManager.startGame();
  });

  // Submit Word
  socket.on('submitWord', ({ roomId, word }) => {
    const gameManager = gameInstances[roomId];
    
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    gameManager.submitWord(socket.id, word);
  });

  // Cast Vote
  socket.on('castVote', ({ roomId, votedPlayerId }) => {
    const gameManager = gameInstances[roomId];
    
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    gameManager.castVote(socket.id, votedPlayerId);
  });

  // Play Again
  socket.on('playAgain', ({ roomId }) => {
    const gameManager = gameInstances[roomId];
    
    if (!gameManager) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    gameManager.resetGame();
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    totalPlayers--;
    // Find and remove player from their room
    for (const roomId in gameInstances) {
      const gameManager = gameInstances[roomId];
      if (gameManager.hasPlayer(socket.id)) {
        gameManager.removePlayer(socket.id);

        if (gameManager.gameState !== 'LOBBY') {
          gameManager.io.in(roomId).emit('gamePaused', { reason: 'A player has disconnected', players: gameManager.getPlayers() });
          gameManager.gameState = 'LOBBY';
        }

        console.log(`Player ${socket.id} disconnected and removed from room ${roomId}`);
        
        // If room is empty, delete it
        if (gameManager.players.length === 0) {
          delete gameInstances[roomId];
          console.log(`Room ${roomId} deleted (empty)`);
        }
        break;
      }
    }
    
    updateGlobalStats();
  });
});

// Helper function to generate room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Hàm mới để broadcast stats (với debouncing)
function updateGlobalStats() {
  const totalRooms = Object.keys(gameInstances).length;

  console.log(`Broadcasting stats: ${totalPlayers} players, ${totalRooms} rooms`);
  // Gửi sự kiện 'globalStatsUpdate' đến TẤT CẢ client đang kết nối
  io.emit('globalStatsUpdate', { totalPlayers, totalRooms });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: Object.keys(gameInstances).length });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
