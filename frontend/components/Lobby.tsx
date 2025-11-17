'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';

interface LobbyProps {
  onJoinRoom: () => void;
}

export default function Lobby({ onJoinRoom }: LobbyProps) {
  const { username, setUsername, createRoom, joinRoom } = useGame();
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleCreateRoom = () => {
    if (username.trim()) {
      createRoom();
      onJoinRoom();
    } else {
      alert('Please enter your username');
    }
  };

  const handleJoinRoom = () => {
    if (username.trim() && joinRoomId.trim()) {
      joinRoom(joinRoomId.toUpperCase());
      onJoinRoom();
    } else {
      alert('Please enter your username and room ID');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={20}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          🎮 Create New Room
        </button>

        <div className="space-y-2">
          <input
            type="text"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
            placeholder="Room ID"
            className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={6}
          />
          <button
            onClick={handleJoinRoom}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
          >
            🚪 Join Room
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">📖 How to Play:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 4-8 players required to start</li>
          <li>• One player is secretly the Impostor</li>
          <li>• Crewmates know the secret keyword</li>
          <li>• Impostor only knows the category</li>
          <li>• Say words related to the keyword without being too obvious!</li>
        </ul>
      </div>
    </div>
  );
}
