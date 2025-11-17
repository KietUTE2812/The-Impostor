'use client';

import { useGame } from '@/contexts/GameContext';
import { useEffect } from 'react';

interface RoomProps {
  onStartGame: () => void;
  onLeave: () => void;
}

export default function Room({ onStartGame, onLeave }: RoomProps) {
  const { roomId, players, isHost, startGame, gameState } = useGame();

  const handleStartGame = () => {
    if (players.length < 4) {
      alert('Need at least 4 players to start!');
      return;
    }
    startGame();
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      onStartGame();
    }
  }, [gameState]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Room Code</h2>
        <div className="text-4xl font-mono font-bold tracking-widest">
          {roomId}
        </div>
        <p className="text-sm mt-2 opacity-90">Share this code with your friends!</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Players ({players.length}/8)
        </h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.socketId}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
            >
              <span className="font-medium text-gray-800">
                {player.username}
              </span>
              {player.isHost && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  👑 Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {players.length < 4 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          ⚠️ Need at least 4 players to start the game
        </div>
      )}

      <div className="flex gap-3">
        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={players.length < 4}
            className={`flex-1 font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg ${
              players.length >= 4
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🚀 Start Game
          </button>
        )}
        <button
          onClick={onLeave}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          🚪 Leave
        </button>
      </div>
    </div>
  );
}
