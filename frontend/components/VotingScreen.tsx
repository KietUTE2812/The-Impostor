'use client';

import { useGame } from '@/contexts/GameContext';
import { useState } from 'react';

export default function VotingScreen() {
  const { players, castVote, socket } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (playerId: string) => {
    if (!hasVoted && playerId !== socket?.id) {
      setSelectedPlayer(playerId);
      castVote(playerId);
      setHasVoted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <div 
        className="max-w-6xl w-full px-8"
        style={{ animation: 'fadeInUp 0.8s ease-out' }}
      >
        {/* Title */}
        <h1 
          className="text-6xl font-bold text-center mb-4"
          style={{
            fontFamily: "'Cinzel', serif",
            background: 'linear-gradient(135deg, #FF6B9D 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px',
            textShadow: '0 0 40px rgba(255, 107, 157, 0.6)'
          }}
        >
          VOTING TIME
        </h1>

        <p 
          className="text-2xl text-center mb-12"
          style={{
            fontFamily: "'Raleway', sans-serif",
            color: '#E0E1DD',
            letterSpacing: '1px'
          }}
        >
          Who do you think is the impostor?
        </p>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {players
            .filter(p => p.socketId !== socket?.id)
            .map((player) => (
              <button
                key={player.socketId}
                onClick={() => handleVote(player.socketId)}
                disabled={hasVoted}
                className="rounded-xl p-6 flex flex-col items-center gap-4 transition-all duration-300 cursor-pointer"
                style={{
                  background: selectedPlayer === player.socketId 
                    ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(157, 78, 221, 0.3))'
                    : 'rgba(27, 38, 59, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: selectedPlayer === player.socketId
                    ? '3px solid #FF6B9D'
                    : '2px solid rgba(0, 255, 245, 0.2)',
                  boxShadow: selectedPlayer === player.socketId
                    ? '0 0 40px rgba(255, 107, 157, 0.5)'
                    : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  opacity: hasVoted && selectedPlayer !== player.socketId ? 0.5 : 1,
                  cursor: hasVoted ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!hasVoted) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.5)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(255, 107, 157, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasVoted) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.2)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  }
                }}
              >
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                  style={{
                    border: '3px solid rgba(0, 255, 245, 0.5)',
                    background: 'linear-gradient(135deg, rgba(0, 255, 245, 0.2), rgba(157, 78, 221, 0.2))',
                    boxShadow: '0 0 20px rgba(0, 255, 245, 0.3)'
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div 
                  className="text-xl font-semibold"
                  style={{
                    color: selectedPlayer === player.socketId ? '#FF6B9D' : '#E0E1DD',
                    letterSpacing: '0.5px'
                  }}
                >
                  {player.username}
                </div>
                {selectedPlayer === player.socketId && (
                  <div 
                    className="text-sm font-bold tracking-wide"
                    style={{ color: '#FF6B9D', letterSpacing: '1px' }}
                  >
                    ✓ VOTED
                  </div>
                )}
              </button>
            ))}
        </div>

        {/* Status Message */}
        <div 
          className="text-center text-xl"
          style={{
            color: hasVoted ? '#00FFF5' : '#778DA9',
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: '0.5px'
          }}
        >
          {hasVoted 
            ? '✓ Vote submitted! Waiting for other players...'
            : 'Click on a player to vote them out'
          }
        </div>

        {/* Timer Visual */}
        <div className="mt-8 flex justify-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-pulse"
            style={{
              border: '3px solid rgba(255, 107, 157, 0.5)',
              background: 'rgba(27, 38, 59, 0.8)',
              color: '#FF6B9D'
            }}
          >
            <i className="fas fa-hourglass-half"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
