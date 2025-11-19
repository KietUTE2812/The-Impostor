'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
  socketId: string;
  username: string;
  isHost: boolean;
}

interface WordHistoryItem {
  round: number;
  playerId: string;
  username: string;
  word: string;
}

interface GameResult {
  votedOutPlayer: {
    socketId: string;
    username: string;
    role: 'crewmate' | 'impostor';
  } | null;
  isImpostor: boolean;
  winner: string;
  keyword: string;
  votes: Record<string, number>;
}

interface GameContextType {
  socket: Socket | null;
  username: string;
  setUsername: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  players: Player[];
  isHost: boolean;
  role: 'crewmate' | 'impostor' | null;
  category: string | null;
  keyword: string | null;
  gameState: 'LOBBY' | 'PLAYING' | 'VOTING' | 'RESULT';
  gameResult: GameResult | null;
  currentTurn: string | null;
  currentRound: number;
  totalRounds: number;
  wordHistory: WordHistoryItem[];
  errorMessage: string | null;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  submitWord: (word: string) => void;
  castVote: (votedPlayerId: string) => void;
  playAgain: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [role, setRole] = useState<'crewmate' | 'impostor' | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'LOBBY' | 'PLAYING' | 'VOTING' | 'RESULT'>('LOBBY');
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [wordHistory, setWordHistory] = useState<WordHistoryItem[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Room events
    socket.on('roomCreated', ({ roomId, players }) => {
      setRoomId(roomId);
      setPlayers(players);
      setIsHost(true);
    });

    socket.on('joinedRoom', ({ roomId, players }) => {
      console.log('Joined room:', roomId);
      setRoomId(roomId);
      setPlayers(players);
      setIsHost(false);
    });

    socket.on('roomUpdate', ({ players } : { players: Player[] }) => {
      setPlayers(players);
      setIsHost(players.find(p => p.socketId === socket.id)?.isHost || false);
    });

    // Game events
    socket.on('gameStart', ({ role, category, keyword }) => {
      console.log('Game starting for room:', roomId, 'Role:', role, 'Category:', category, 'Keyword:', keyword);
      setRole(role);
      setCategory(category);
      setKeyword(keyword || null);
      setGameState('PLAYING');
    });

    socket.on('nextTurn', ({ playerId, username, round }) => {
      setCurrentTurn(playerId);
      setCurrentRound(round);
    });

    socket.on('wordSubmitted', ({ wordHistory }) => {
      setWordHistory(wordHistory);
    });

    socket.on('startVoting', ({ wordHistory }) => {
      setGameState('VOTING');
      setWordHistory(wordHistory);
    });

    socket.on('gameResult', (result : GameResult) => {
      setGameState('RESULT');
      setGameResult(result);
    });

    socket.on('gameReset', ({ players }) => {
      setGameState('LOBBY');
      setPlayers(players);
      setRole(null);
      setCategory(null);
      setKeyword(null);
      setCurrentTurn(null);
      setWordHistory([]);
    });

    socket.on('gamePaused', ({ reason, players }) => {
      setErrorMessage(reason);
      setGameState('LOBBY');
      setPlayers(players);
      setRole(null);
      setCategory(null);
      setKeyword(null);
      setCurrentTurn(null);
      setWordHistory([]);
    });

    socket.on('error', ({ message }) => {
      setErrorMessage(message);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('joinedRoom');
      socket.off('roomUpdate');
      socket.off('gameStart');
      socket.off('nextTurn');
      socket.off('wordSubmitted');
      socket.off('startVoting');
      socket.off('gameResult');
      socket.off('gameReset');
      socket.off('error');
    };
  }, [socket]);

  const createRoom = () => {
    if (socket && username) {
      socket.emit('createRoom', { username });
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket && username) {
      socket.emit('joinRoom', { username, roomId });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { roomId });
    }
  }

  const startGame = () => {
    
    if (socket && roomId) {
      console.log('Starting game in room:', roomId);
      socket.emit('startGame', { roomId });
    }
  };

  const submitWord = (word: string) => {
    if (socket && roomId) {
      socket.emit('submitWord', { roomId, word });
    }
  };

  const castVote = (votedPlayerId: string) => {
    if (socket && roomId) {
      socket.emit('castVote', { roomId, votedPlayerId });
    }
  };

  const playAgain = () => {
    if (socket && roomId) {
      socket.emit('playAgain', { roomId });
    }
  };

  const value = {
    socket,
    username,
    setUsername,
    roomId,
    setRoomId,
    players,
    isHost,
    role,
    category,
    keyword,
    gameState,
    gameResult,
    currentTurn,
    currentRound,
    totalRounds,
    wordHistory,
    errorMessage,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    submitWord,
    castVote,
    playAgain,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
