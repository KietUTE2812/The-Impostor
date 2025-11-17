'use client';

import { useState } from 'react';
import Lobby from '@/components/Lobby';
import Room from '@/components/Room';
import GameScreen from '@/components/GameScreen';
import { GameProvider } from '@/contexts/GameContext';

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
            🕵️ Word Impostor
          </h1>
          <GameContent />
        </div>
      </main>
    </GameProvider>
  );
}

function GameContent() {
  const [view, setView] = useState<'lobby' | 'room' | 'game'>('lobby');

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {view === 'lobby' && <Lobby onJoinRoom={() => setView('room')} />}
      {view === 'room' && <Room onStartGame={() => setView('game')} onLeave={() => setView('lobby')} />}
      {view === 'game' && <GameScreen onGameEnd={() => setView('room')} />}
    </div>
  );
}
