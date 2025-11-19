'use client';

import { use, useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import ErrorModal from './ErrorModal';

interface LobbyProps {
  onJoined: () => void;
}

export default function Lobby({ onJoined }: LobbyProps) {
  const {socket, username, setUsername, createRoom, joinRoom } = useGame();
  const [joinRoomId, setJoinRoomId] = useState('');
  const [globalState, setGlobalState] = useState<{ totalPlayers: number; totalRooms: number }>({ totalPlayers: 0, totalRooms: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalStatsUpdate = (data: { totalPlayers: number; totalRooms: number }) => {
      setGlobalState(data);
    };

    socket?.on('globalStatsUpdate', handleGlobalStatsUpdate);
    return () => {
      socket?.off('globalStatsUpdate', handleGlobalStatsUpdate);
    }
  }, [socket]);

  const handleCreateRoom = () => {
    if (username.trim()) {
      createRoom();
      onJoined();
    } else {
      setErrorMessage('Please enter your username');
    }
  };

  const handleJoinRoom = () => {
    if (username.trim() && joinRoomId.trim()) {
      joinRoom(joinRoomId.toUpperCase());
      onJoined();
    } else {
      setErrorMessage('Please enter your username and room ID');
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-5 pb-24">
      <div className="w-full max-w-[1400px]" style={{ animation: 'fadeInUp 1s ease-out' }}>
        {/* Logo Section */}
        <div className="text-center mb-16">
          <h1 
            className="text-[clamp(48px,5vw,72px)] font-bold mb-4"
            style={{
              fontFamily: "'Cinzel', serif",
              letterSpacing: '3px',
              background: 'linear-gradient(135deg, #00FFF5 0%, #9D4EDD 50%, #FF6B9D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(0, 255, 245, 0.5)',
              animation: 'logoGlow 3s ease-in-out infinite'
            }}
          >
            THE IMPOSTOR GAME
          </h1>
          <p 
            className="text-[clamp(18px,2vw,24px)] italic opacity-80"
            style={{
              fontFamily: "'Raleway', sans-serif",
              color: '#00FFF5',
              letterSpacing: '1px'
            }}
          >
            Where Secrets Hide in Plain Sight
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-12 max-w-[1200px] mx-auto px-5">

          {/* Action Panel */}
          <div className="flex flex-col justify-center items-center gap-8">
            {/* Username Input */}
            <div className="w-full max-w-[400px]">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-14 px-4 rounded-lg text-base transition-all duration-300 outline-none"
                style={{
                  background: 'rgba(65, 90, 119, 0.3)',
                  border: '2px solid rgba(0, 255, 245, 0.3)',
                  color: '#E0E1DD',
                  fontFamily: "'Raleway', sans-serif"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00FFF5';
                  e.target.style.background = 'rgba(65, 90, 119, 0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 245, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 255, 245, 0.3)';
                  e.target.style.background = 'rgba(65, 90, 119, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
                maxLength={20}
              />
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateRoom}
              className="w-full max-w-[400px] h-14 rounded-lg font-semibold text-xl tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #9D4EDD 0%, #00FFF5 100%)',
                border: 'none',
                color: '#E0E1DD',
                fontFamily: "'Raleway', sans-serif",
                letterSpacing: '1px',
                boxShadow: '0 0 20px rgba(0, 255, 245, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 255, 245, 0.6), 0 0 60px rgba(157, 78, 221, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 245, 0.4)';
              }}
            >
              CREATE NEW GAME
            </button>

            {/* Divider */}
            <div className="flex items-center w-full max-w-[400px] gap-4 text-base tracking-widest" style={{ color: '#778DA9' }}>
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 255, 245, 0.3), transparent)' }} />
              OR
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 255, 245, 0.3), transparent)' }} />
            </div>

            {/* Join Section */}
            <div 
              className="w-full max-w-[400px] rounded-xl p-8 transition-all duration-400 hover:-translate-y-1"
              style={{
                background: 'rgba(27, 38, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 245, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(157, 78, 221, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.2)';
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
                Join Existing Game
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  placeholder="Game Code"
                  className="flex-1 h-[52px] px-4 rounded-lg text-base uppercase tracking-widest transition-all duration-300 outline-none"
                  style={{
                    background: 'rgba(65, 90, 119, 0.3)',
                    border: '2px solid rgba(0, 255, 245, 0.3)',
                    color: '#E0E1DD',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '2px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00FFF5';
                    e.target.style.background = 'rgba(65, 90, 119, 0.5)';
                    e.target.style.boxShadow = '0 0 20px rgba(0, 255, 245, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 255, 245, 0.3)';
                    e.target.style.background = 'rgba(65, 90, 119, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                  maxLength={6}
                />
                <button
                  onClick={handleJoinRoom}
                  className="h-[52px] px-7 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 w-full sm:w-auto"
                  style={{
                    background: 'transparent',
                    border: '2px solid #00FFF5',
                    color: '#00FFF5',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00FFF5';
                    e.currentTarget.style.color = '#0D1B2A';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 245, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#00FFF5';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          {/* How to Play Panel */}
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
                      <h2 
                        className="text-[clamp(28px,3vw,36px)] font-semibold text-center mb-8"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: '#00FFF5',
                          letterSpacing: '2px',
                          textShadow: '0 0 20px rgba(0, 255, 245, 0.6)'
                        }}
                      >
                        How to Play
                      </h2>
                      <ul className="space-y-6">
                        {[
                          { icon: 'fa-users', text: '4-8 players required to start' },
                          { icon: 'fa-mask', text: 'One player is secretly the Impostor' },
                          { icon: 'fa-key', text: 'Crewmates know the secret keyword' },
                          { icon: 'fa-question-circle', text: 'Impostor only knows the category' },
                          { icon: 'fa-comments', text: 'Say words related to the keyword without being too obvious!' }
                        ].map((rule, index) => (
                          <li 
                            key={index}
                            className="flex items-start text-base leading-relaxed transition-all duration-300 hover:translate-x-1"
                          >
                            <div 
                              className="min-w-[32px] h-8 flex items-center justify-center mr-4 text-lg transition-all duration-300"
                              style={{
                                color: '#9D4EDD',
                                filter: 'drop-shadow(0 0 8px rgba(157, 78, 221, 0.6))'
                              }}
                            >
                              <i className={`fas ${rule.icon}`}></i>
                            </div>
                            <span>{rule.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>          
        </div>
      </div>

      {/* Stats Ticker */}
      <div 
        className="fixed bottom-0 left-0 w-full py-4 z-[100] overflow-hidden"
        style={{
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(0, 255, 245, 0.2)'
        }}
      >
        <div 
          className="flex items-center justify-center gap-10 text-sm tracking-wide"
          style={{
            color: '#778DA9',
            letterSpacing: '0.5px'
          }}
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-circle text-xs" style={{ color: '#00FFF5' }}></i>
            <span><span className="font-semibold" style={{ color: '#9D4EDD' }}>{globalState.totalPlayers}</span> players online</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-gamepad text-xs" style={{ color: '#00FFF5' }}></i>
            <span><span className="font-semibold" style={{ color: '#9D4EDD' }}>{globalState.totalRooms}</span> games in progress</span>
          </div>
        </div>
      </div>
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
    </div>
  );
}
