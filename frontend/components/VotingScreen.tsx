'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';

export default function VotingScreen() {
  const { socket, players, castVote } = useGame();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleVote = (playerId: string) => {
    if (!hasVoted) {
      castVote(playerId);
      setHasVoted(true);
      setSelectedPlayer(playerId);
    }
  };

  return (
    <div className="bg-yellow-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🗳️ Voting Time!
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Who do you think is the Impostor?
      </p>

      <div className="grid grid-cols-2 gap-3">
        {players
          .filter(player => player.socketId !== socket?.id)
          .map(player => (
            <button
              key={player.socketId}
              onClick={() => handleVote(player.socketId)}
              disabled={hasVoted}
              className={`p-4 rounded-lg font-bold text-gray-800 transition-all duration-200 ${
                selectedPlayer === player.socketId
                  ? 'bg-red-500 text-white ring-4 ring-red-300'
                  : hasVoted
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50'
              }`}
            >
              {player.username}
              {selectedPlayer === player.socketId && ' ✓'}
            </button>
          ))}
      </div>

      {hasVoted && (
        <div className="mt-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-center">
          ✅ Vote submitted! Waiting for others...
        </div>
      )}
    </div>
  );
}
