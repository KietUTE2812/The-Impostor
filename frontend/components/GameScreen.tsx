'use client';

import { useGame } from '@/contexts/GameContext';
import { useState, useEffect } from 'react';
import RoleDisplay from './RoleDisplay';
import WordHistory from './WordHistory';
import InputBox from './InputBox';
import VotingScreen from './VotingScreen';
import ResultsScreen from './ResultsScreen';

export default function GameScreen() {
  const { gameState, role, category, keyword, currentRound, totalRounds } = useGame();
  const [showRole, setShowRole] = useState(true);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      setShowRole(true);
      const timer = setTimeout(() => setShowRole(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentRound]);

  if (showRole && gameState === 'PLAYING' && role && category) {
    return <RoleDisplay role={role} category={category} keyword={keyword || ''} />;
  }

  if (gameState === 'VOTING') {
    return <VotingScreen />;
  }

  if (gameState === 'RESULT') {
    return <ResultsScreen />;
  }

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center px-5 pt-32 pb-20">
      {/* Round Counter */}
      <div 
        className="mb-8 px-8 py-4 rounded-full"
        style={{
          background: 'rgba(27, 38, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 255, 245, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 245, 0.3)'
        }}
      >
        <span 
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Cinzel', serif",
            background: 'linear-gradient(135deg, #00FFF5 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px'
          }}
        >
          ROUND {currentRound} / {totalRounds}
        </span>
      </div>

      {/* Category Display */}
      <div 
        className="mb-8 px-12 py-5 rounded-xl"
        style={{
          background: 'rgba(27, 38, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(157, 78, 221, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-sm tracking-wide mb-2" style={{ color: '#778DA9', letterSpacing: '1px' }}>
          CATEGORY
        </div>
        <div 
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Philosopher', sans-serif",
            color: '#9D4EDD',
            textShadow: '0 0 20px rgba(157, 78, 221, 0.6)',
            letterSpacing: '1px'
          }}
        >
          {category}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        <WordHistory />
        <InputBox />
      </div>
    </div>
  );
}
