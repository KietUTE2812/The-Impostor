const WordBank = require('../models/WordBank');

class GameManager {
  constructor(roomId, io) {
    this.roomId = roomId;
    this.io = io;
    this.players = []; // [{ socketId, username, isHost, role, hasVoted }]
    this.gameState = 'LOBBY'; // LOBBY, STARTING, PLAYING, VOTING, RESULT
    this.category = null;
    this.keyword = null;
    this.impostorId = null;
    this.currentRound = 0;
    this.totalRounds = 1;
    this.currentTurnIndex = 0;
    this.turnOrder = [];
    this.wordHistory = []; // [{ round, playerId, username, word }]
    this.votes = {}; // { voterId: votedPlayerId }
  }

  // Player Management
  addPlayer(socketId, username, isHost = false) {
    this.players.push({
      socketId,
      username,
      isHost,
      role: null,
      hasVoted: false
    });
  }

  removePlayer(socketId) {
    const playerIndex = this.players.findIndex(p => p.socketId === socketId);
    if (playerIndex !== -1) {
      const player = this.players[playerIndex];
      this.players.splice(playerIndex, 1);
      
      // If host left, assign new host
      if (player.isHost && this.players.length > 0) {
        this.players[0].isHost = true;
      }
      
      this.io.in(this.roomId).emit('roomUpdate', { players: this.getPlayers() });
    }
  }

  hasPlayer(socketId) {
    return this.players.some(p => p.socketId === socketId);
  }

  isHost(socketId) {
    const player = this.players.find(p => p.socketId === socketId);
    return player && player.isHost;
  }

  getPlayers() {
    return this.players.map(p => ({
      socketId: p.socketId,
      username: p.username,
      isHost: p.isHost
    }));
  }

  // Game Flow
  async startGame() {
    this.gameState = 'STARTING';
    
    // Fetch random word from database
    const wordData = await this.fetchRandomWord();
    if (!wordData) {
      this.io.in(this.roomId).emit('error', { message: 'Failed to load word bank' });
      this.gameState = 'LOBBY';
      return;
    }

    this.category = wordData.category;
    this.keyword = wordData.keyword;

    // Assign roles
    this.assignRoles();

    // Set up turn order
    this.turnOrder = this.shuffleArray([...this.players.map(p => p.socketId)]);
    this.currentTurnIndex = 0;
    this.currentRound = 1;

    // Send role information to each player
    this.sendRoleInformation();

    // Start first turn
    this.gameState = 'PLAYING';
    this.startNextTurn();
  }

  async fetchRandomWord() {
    try {
      const count = await WordBank.countDocuments();
      if (count === 0) {
        console.error('No words in database');
        return null;
      }

      const random = Math.floor(Math.random() * count);
      const wordBank = await WordBank.findOne().skip(random);
      
      if (!wordBank || wordBank.keywords.length === 0) {
        return null;
      }

      const randomKeyword = wordBank.keywords[Math.floor(Math.random() * wordBank.keywords.length)];
      
      return {
        category: wordBank.category,
        keyword: randomKeyword
      };
    } catch (error) {
      console.error('Error fetching word:', error);
      return null;
    }
  }

  assignRoles() {
    // Randomly select one player to be impostor
    const randomIndex = Math.floor(Math.random() * this.players.length);
    this.impostorId = this.players[randomIndex].socketId;

    this.players.forEach(player => {
      player.role = player.socketId === this.impostorId ? 'impostor' : 'crewmate';
    });
  }

  sendRoleInformation() {
    this.players.forEach(player => {
      console.log('Sending role to player:', player.socketId, 'Role:', player.role);
      if (player.role === 'impostor') {
        this.io.to(player.socketId).emit('gameStart', {
          role: 'impostor',
          category: this.category,
          keyword: null
        });
      } else {
        this.io.to(player.socketId).emit('gameStart', {
          role: 'crewmate',
          category: this.category,
          keyword: this.keyword
        });
      }
    });
  }

  startNextTurn() {
    if (this.currentTurnIndex >= this.turnOrder.length) {
      // Round complete
      this.currentRound++;
      this.currentTurnIndex = 0;

      if (this.currentRound > this.totalRounds) {
        // All rounds complete, start voting
        this.startVoting();
        return;
      }

      // Shuffle turn order for next round
      this.turnOrder = this.shuffleArray([...this.turnOrder]);
    }

    const currentPlayerId = this.turnOrder[this.currentTurnIndex];
    const currentPlayer = this.players.find(p => p.socketId === currentPlayerId);

    this.io.in(this.roomId).emit('nextTurn', {
      playerId: currentPlayerId,
      username: currentPlayer.username,
      round: this.currentRound,
      totalRounds: this.totalRounds
    });
  }

  submitWord(socketId, word) {
    // Validate it's the player's turn
    const currentPlayerId = this.turnOrder[this.currentTurnIndex];
    if (socketId !== currentPlayerId) {
      this.io.to(socketId).emit('error', { message: 'Not your turn' });
      return;
    }

    if (this.gameState !== 'PLAYING') {
      this.io.to(socketId).emit('error', { message: 'Game is not in playing state' });
      return;
    }

    const player = this.players.find(p => p.socketId === socketId);
    
    // Add word to history
    this.wordHistory.push({
      round: this.currentRound,
      playerId: socketId,
      username: player.username,
      word: word.trim()
    });

    // Broadcast word to all players
    this.io.in(this.roomId).emit('wordSubmitted', {
      playerId: socketId,
      username: player.username,
      word: word.trim(),
      round: this.currentRound,
      wordHistory: this.wordHistory
    });

    // Move to next turn
    this.currentTurnIndex++;
    setTimeout(() => {
      this.startNextTurn();
    }, 1000); // Small delay before next turn
  }

  startVoting() {
    this.gameState = 'VOTING';
    this.votes = {};
    
    this.players.forEach(p => {
      p.hasVoted = false;
    });

    this.io.in(this.roomId).emit('startVoting', {
      players: this.getPlayers(),
      wordHistory: this.wordHistory
    });
  }

  castVote(voterId, votedPlayerId) {
    if (this.gameState !== 'VOTING') {
      this.io.to(voterId).emit('error', { message: 'Not in voting phase' });
      return;
    }

    const voter = this.players.find(p => p.socketId === voterId);
    if (!voter) {
      return;
    }

    if (voter.hasVoted) {
      this.io.to(voterId).emit('error', { message: 'Already voted' });
      return;
    }

    if (voterId === votedPlayerId) {
      this.io.to(voterId).emit('error', { message: 'Cannot vote for yourself' });
      return;
    }

    this.votes[voterId] = votedPlayerId;
    voter.hasVoted = true;

    // Notify room of vote count
    const votedCount = Object.keys(this.votes).length;
    this.io.in(this.roomId).emit('voteUpdate', {
      votedCount,
      totalPlayers: this.players.length
    });

    // Check if all players have voted
    if (votedCount === this.players.length) {
      this.calculateResults();
    }
  }

  calculateResults() {
    // Count votes
    const voteCounts = {};
    for (const votedPlayerId of Object.values(this.votes)) {
      voteCounts[votedPlayerId] = (voteCounts[votedPlayerId] || 0) + 1;
    }

    // Find player with most votes
    let maxVotes = 0;
    let votedOutPlayerId = null;
    for (const [playerId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        votedOutPlayerId = playerId;
      }
    }

    const votedOutPlayer = this.players.find(p => p.socketId === votedOutPlayerId);
    const isImpostor = votedOutPlayerId === this.impostorId;
    const winner = isImpostor ? 'crewmates' : 'impostor';

    this.gameState = 'RESULT';

    this.io.in(this.roomId).emit('gameResult', {
      votedOutPlayer: {
        socketId: votedOutPlayer.socketId,
        username: votedOutPlayer.username,
        role: votedOutPlayer.role
      },
      isImpostor,
      winner,
      keyword: this.keyword,
      votes: this.votes
    });
  }

  resetGame() {
    this.gameState = 'LOBBY';
    this.category = null;
    this.keyword = null;
    this.impostorId = null;
    this.currentRound = 0;
    this.currentTurnIndex = 0;
    this.turnOrder = [];
    this.wordHistory = [];
    this.votes = {};
    
    this.players.forEach(p => {
      p.role = null;
      p.hasVoted = false;
    });

    this.io.in(this.roomId).emit('gameReset', { players: this.getPlayers() });
  }

  // Utility
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

module.exports = GameManager;
