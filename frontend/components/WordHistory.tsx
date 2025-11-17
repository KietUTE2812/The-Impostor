'use client';

import { useGame } from '@/contexts/GameContext';

export default function WordHistory() {
  const { wordHistory } = useGame();

  if (wordHistory.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-2">📝 Word History</h3>
        <p className="text-gray-500">No words yet. Game will start soon...</p>
      </div>
    );
  }

  // Group by round
  const rounds: { [key: number]: typeof wordHistory } = {};
  wordHistory.forEach(item => {
    if (!rounds[item.round]) {
      rounds[item.round] = [];
    }
    rounds[item.round].push(item);
  });

  return (
    <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Word History</h3>
      <div className="space-y-4">
        {Object.entries(rounds).map(([round, words]) => (
          <div key={round}>
            <h4 className="font-bold text-purple-600 mb-2">Round {round}</h4>
            <div className="space-y-2">
              {words.map((item, idx) => (
                <div key={idx} className="bg-white px-4 py-2 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-gray-800">{item.username}:</span>
                  <span className="text-blue-600 font-bold text-lg">&quot;{item.word}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
