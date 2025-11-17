'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';

export default function InputBox() {
  const { socket, currentTurn, submitWord } = useGame();
  const [word, setWord] = useState('');

  const isMyTurn = currentTurn && socket && currentTurn.playerId === socket.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && isMyTurn) {
      submitWord(word.trim());
      setWord('');
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 p-6 rounded-lg">
      {currentTurn && (
        <div className="mb-4">
          <p className="text-center text-lg">
            <span className="font-bold text-purple-600">Round {currentTurn.round}</span>
            {' - '}
            {isMyTurn ? (
              <span className="text-green-600 font-bold">It&apos;s YOUR turn! 🎯</span>
            ) : (
              <span className="text-gray-600">Waiting for <span className="font-bold">{currentTurn.username}</span>...</span>
            )}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder={isMyTurn ? "Type your word..." : "Wait for your turn..."}
          disabled={!isMyTurn}
          className={`flex-1 text-gray-800 px-4 py-3 border-2 rounded-lg focus:outline-none ${
            isMyTurn
              ? 'border-blue-500 focus:border-blue-600'
              : 'border-gray-300 bg-gray-100 cursor-not-allowed'
          }`}
          maxLength={30}
        />
        <button
          type="submit"
          disabled={!isMyTurn || !word.trim()}
          className={`px-8 py-3 font-bold rounded-lg transition-colors duration-200 ${
            isMyTurn && word.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
