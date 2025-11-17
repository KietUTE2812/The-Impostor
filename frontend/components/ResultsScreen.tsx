'use client';

import { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';

// interface GameResult {
//   votedOutPlayer: {
//     socketId: string;
//     username: string;
//     role: string;
//   };
//   isImpostor: boolean;
//   winner: string;
//   keyword: string;
//   votes: { [key: string]: number };
// }

interface ResultsScreenProps {
  onPlayAgain: () => void;
}

export default function ResultsScreen({ onPlayAgain }: ResultsScreenProps) {
  const { playAgain, gameResults, players } = useGame();

  console.log('Game Results:', gameResults);

  if (!gameResults) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  const crewmatesWon = gameResults.winner === 'crewmates';

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-lg text-white text-center ${
        crewmatesWon 
          ? 'bg-gradient-to-r from-green-500 to-blue-500' 
          : 'bg-gradient-to-r from-red-500 to-pink-500'
      }`}>
        <h2 className="text-4xl font-bold mb-4">
          {crewmatesWon ? '🎉 Crewmates Win!' : '😈 Impostor Wins!'}
        </h2>
        <p className="text-xl">
          <span className="font-bold">{gameResults.votedOutPlayer?.username}</span> was voted out!
        </p>
        <p className="text-lg mt-2">
          They were the <span className="font-bold uppercase">{gameResults.votedOutPlayer?.role}</span>
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
          The Secret Keyword Was:
        </h3>
        <p className="text-3xl font-bold text-blue-600 text-center">
          &quot;{gameResults.keyword}&quot;
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Vote Results:</h3>
        <div className="space-y-2">
          {Object.entries(gameResults.votes)
            .sort(([, a], [, b]) => b - a)
            .map(([playerId, count]) => {
              const player = gameResults.votedOutPlayer?.socketId === playerId 
                ? gameResults.votedOutPlayer?.username 
                : players.find(p => p.socketId === playerId)?.username || 'Unknown';
              return (
                <div key={playerId} className="flex justify-between items-center bg-white px-4 py-2 rounded">
                  <span className="font-medium text-gray-800">{player}</span>
                  <span className="font-bold text-red-600">{count} vote{count !== 1 ? 's' : ''}</span>
                </div>
              );
            })}
        </div>
      </div>

      <button
        onClick={() => {
          playAgain();
          onPlayAgain();
        }}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
      >
        🔄 Play Again
      </button>
    </div>
  );
}
