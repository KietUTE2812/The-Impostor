'use client';

import { useGame } from '@/contexts/GameContext';

export default function RoleDisplay() {
  const { role, category, keyword } = useGame();

  if (!role) return null;

  return (
    <div className={`p-6 rounded-lg ${
      role === 'impostor' 
        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
        : 'bg-gradient-to-r from-green-500 to-blue-500'
    }`}>
      <div className="text-white">
        {role === 'crewmate' ? (
          <>
            <h2 className="text-2xl font-bold mb-2">🛡️ You are a Crewmate</h2>
            <p className="text-lg mb-1">Category: <span className="font-bold">{category}</span></p>
            <p className="text-xl">Secret Keyword: <span className="font-bold text-yellow-300">{keyword}</span></p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">🎭 You are the Impostor</h2>
            <p className="text-lg">Category: <span className="font-bold">{category}</span></p>
            <p className="text-sm mt-2 opacity-90">You don't know the keyword. Listen carefully and try to blend in!</p>
          </>
        )}
      </div>
    </div>
  );
}
