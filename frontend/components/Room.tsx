'use client';

import { useGame } from '@/contexts/GameContext';
import { useState } from 'react';

interface RoomProps {
  onStartGame: () => void;
  onLeave: () => void;
}

export default function Room({ onStartGame, onLeave }: RoomProps) {
  const { roomId, players, isHost, startGame, socket } = useGame();
  const [isCopy, setIsCopy] = useState(false);

  console.log('Room component players:', isHost, players);

  const handleStartGame = () => {
    if (players.length < 4) {
      alert('Need at least 4 players to start!');
      return;
    }
    startGame();
    onStartGame();
  };

  const copyGameCode = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 2000);
    });
  };

  const currentPlayer = players.find(p => p.socketId === socket?.id);

  return (
    <>
      {/* Header */}
      <div 
        className="fixed top-0 left-0 w-full h-20 z-[100] flex items-center justify-between px-10"
        style={{
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 255, 245, 0.2)'
        }}
      >
        <div 
          className="text-[28px] font-bold"
          style={{
            fontFamily: "'Cinzel', serif",
            background: 'linear-gradient(135deg, #00FFF5 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px'
          }}
        >
          THE IMPOSTOR GAME
        </div>

        <div 
          className="flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={copyGameCode}
        >
          <span 
            className="text-xl tracking-wide"
            style={{ fontFamily: "'Philosopher', sans-serif", color: '#778DA9', letterSpacing: '1px' }}
          >
            CODE: 
          </span>
          <span 
            className="text-5xl font-bold tracking-widest"
            style={{
              fontFamily: "'Philosopher', sans-serif",
              color: '#00FFF5',
              letterSpacing: '4px',
              textShadow: '0 0 20px rgba(0, 255, 245, 0.6)',
              animation: 'codeGlow 2s ease-in-out infinite'
            }}
          >
            {roomId}
          </span>
          {isCopy ? (
            <i className="fas fa-check-double text-xl opacity-70 hover:opacity-100" style={{ color: '#9D4EDD' }}></i>
          ) : (
            <i className="fas fa-copy text-xl opacity-70 hover:opacity-100" style={{ color: '#9D4EDD' }}></i>
          )}
        </div>

        <button
          onClick={onLeave}
          className="h-11 px-6 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300"
          style={{
            background: 'transparent',
            border: '2px solid #FF6B9D',
            color: '#FF6B9D',
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FF6B9D';
            e.currentTarget.style.color = '#0D1B2A';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 157, 0.5)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#FF6B9D';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <i className="fas fa-door-open mr-2"></i> Leave Game
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-32 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12">
          {/* Left Section - Players */}
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <h2 
              className="text-[42px] font-semibold text-center mb-12"
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#00FFF5',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(0, 255, 245, 0.6)'
              }}
            >
              Summoning Circle
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Actual Players */}
              {players.map((player) => (
                <div
                  key={player.socketId}
                  className="rounded-xl p-6 h-[180px] flex flex-col items-center justify-center gap-4 transition-all duration-400 hover:-translate-y-1 relative overflow-hidden"
                  style={{
                    background: 'rgba(27, 38, 59, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(0, 255, 245, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 255, 245, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.2)';
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-[32px] relative"
                    style={{
                      border: '3px solid rgba(0, 255, 245, 0.4)',
                      background: 'linear-gradient(135deg, rgba(0, 255, 245, 0.2), rgba(157, 78, 221, 0.2))',
                      boxShadow: '0 0 20px rgba(0, 255, 245, 0.3)'
                    }}
                  >
                    <i className="fas fa-user"></i>
                    {player.isHost && (
                      <i 
                        className="fas fa-crown absolute -top-2 -right-2 text-xl"
                        style={{
                          color: '#FFD700',
                          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                          animation: 'crownFloat 2s ease-in-out infinite'
                        }}
                      ></i>
                    )}
                  </div>
                  <div className="text-xl font-semibold tracking-wide" style={{ color: '#E0E1DD', letterSpacing: '0.5px' }}>
                    {player.username}
                  </div>
                  <div className="text-sm font-medium tracking-wide" style={{ color: '#9D4EDD', letterSpacing: '0.5px' }}>
                    {player.socketId === socket?.id ? 'You' : 'Ready'}
                  </div>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: 8 - players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="rounded-xl p-6 h-[180px] flex flex-col items-center justify-center gap-4"
                  style={{
                    background: 'rgba(27, 38, 59, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '2px dashed rgba(119, 141, 169, 0.3)'
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-[32px]"
                    style={{
                      border: '3px solid rgba(119, 141, 169, 0.3)',
                      background: 'rgba(27, 38, 59, 0.3)',
                      color: '#778DA9'
                    }}
                  >
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <div className="text-base italic" style={{ color: '#778DA9' }}>
                    Waiting...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Info */}
          <div className="flex flex-col gap-8" style={{ animation: 'fadeInUp 1s ease-out' }}>
            {/* Players Counter */}
            <div 
              className="rounded-xl p-8 transition-all duration-400 hover:-translate-y-1"
              style={{
                background: 'rgba(27, 38, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 245, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 255, 245, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.2)';
              }}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-40 h-40">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#9D4EDD', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00FFF5', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(65, 90, 119, 0.3)" strokeWidth="8" />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="none" 
                      stroke="url(#progressGradient)" 
                      strokeWidth="8" 
                      strokeDasharray="440" 
                      strokeDashoffset={440 - (440 * players.length / 8)}
                      strokeLinecap="round" 
                      transform="rotate(-90 80 80)"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 245, 0.5))' }}
                    />
                  </svg>
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold"
                    style={{
                      fontFamily: "'Philosopher', sans-serif",
                      color: '#00FFF5',
                      textShadow: '0 0 30px rgba(0, 255, 245, 0.8)'
                    }}
                  >
                    {players.length}/8
                  </div>
                </div>
                <div className="text-base text-center tracking-wide" style={{ color: '#778DA9', letterSpacing: '0.5px' }}>
                  {players.length < 4 ? 'Waiting for more players...' : 'Ready to start!'}
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div 
              className="rounded-xl p-8 transition-all duration-400 hover:-translate-y-1"
              style={{
                background: 'rgba(27, 38, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 245, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h3 
                className="text-2xl font-semibold text-center mb-6"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: '#9D4EDD',
                  letterSpacing: '1px'
                }}
              >
                Game Info
              </h3>
              <div className="space-y-3 text-base" style={{ color: '#E0E1DD' }}>
                <div className="flex justify-between">
                  <span style={{ color: '#778DA9' }}>Rounds:</span>
                  <span style={{ color: '#00FFF5', fontWeight: 600 }}>3</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#778DA9' }}>Players needed:</span>
                  <span style={{ color: '#00FFF5', fontWeight: 600 }}>4 minimum</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#778DA9' }}>Your role:</span>
                  <span style={{ color: '#9D4EDD', fontWeight: 600 }}>
                    {currentPlayer?.username || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      {isHost && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4">
          <button
            onClick={handleStartGame}
            disabled={players.length < 4}
            className="w-80 h-16 rounded-lg font-semibold text-2xl tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden"
            style={{
              background: players.length >= 4 
                ? 'linear-gradient(135deg, #9D4EDD 0%, #00FFF5 100%)'
                : 'rgba(65, 90, 119, 0.5)',
              border: 'none',
              color: players.length >= 4 ? '#E0E1DD' : '#778DA9',
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '1px',
              boxShadow: players.length >= 4 
                ? '0 0 30px rgba(0, 255, 245, 0.5)'
                : 'none',
              animation: players.length >= 4 ? 'startPulse 2s ease-in-out infinite' : 'none',
              cursor: players.length >= 4 ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => {
              if (players.length >= 4) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 245, 0.8), 0 0 80px rgba(157, 78, 221, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (players.length >= 4) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 245, 0.5)';
              }
            }}
          >
            START GAME
          </button>
          <div className="text-sm tracking-wide text-center" style={{ color: '#778DA9', letterSpacing: '0.5px' }}>
            {players.length} players ready • Minimum 4 required
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes crownFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes startPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(0, 255, 245, 0.5), 0 0 50px rgba(157, 78, 221, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(0, 255, 245, 0.8), 0 0 80px rgba(157, 78, 221, 0.6);
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  );
}
