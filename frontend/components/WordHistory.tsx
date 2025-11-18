'use client';

import { useGame } from '@/contexts/GameContext';

export default function WordHistory() {
  const { wordHistory, players } = useGame();

  return (
    <div 
      className="flex-1 rounded-xl p-8"
      style={{
        background: 'rgba(27, 38, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 255, 245, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        minHeight: '500px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}
    >
      <h3 
        className="text-2xl font-semibold mb-6 text-center"
        style={{
          fontFamily: "'Cinzel', serif",
          color: '#00FFF5',
          letterSpacing: '1px',
          textShadow: '0 0 20px rgba(0, 255, 245, 0.6)'
        }}
      >
        <i className="fas fa-comments mr-3"></i>
        Word History
      </h3>

      <div className="space-y-4">
        {wordHistory.length === 0 ? (
          <div 
            className="text-center py-12"
            style={{ color: '#778DA9' }}
          >
            <i className="fas fa-hourglass-half text-5xl mb-4 opacity-50"></i>
            <p className="text-lg">Waiting for the first word...</p>
          </div>
        ) : (
          wordHistory.map((entry, index) => {
            const player = players.find(p => p.socketId === entry.playerId);
            return (
              <div 
                key={index}
                className="rounded-lg p-4 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(13, 27, 42, 0.6)',
                  border: '1px solid rgba(0, 255, 245, 0.15)',
                  animation: index === wordHistory.length - 1 ? 'fadeInUp 0.5s ease-out' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 255, 245, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 245, 0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                      style={{
                        border: '2px solid rgba(0, 255, 245, 0.4)',
                        background: 'linear-gradient(135deg, rgba(0, 255, 245, 0.2), rgba(157, 78, 221, 0.2))',
                        color: '#00FFF5'
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <span 
                      className="font-semibold text-lg"
                      style={{ color: '#E0E1DD', letterSpacing: '0.5px' }}
                    >
                      {player?.username || 'Unknown'}
                    </span>
                  </div>
                  <span 
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(157, 78, 221, 0.2)',
                      color: '#9D4EDD',
                      border: '1px solid rgba(157, 78, 221, 0.3)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Round {entry.round}
                  </span>
                </div>
                <div 
                  className="text-2xl font-bold ml-13"
                  style={{
                    fontFamily: "'Philosopher', sans-serif",
                    color: '#00FFF5',
                    textShadow: '0 0 15px rgba(0, 255, 245, 0.5)',
                    letterSpacing: '1px'
                  }}
                >
                  "{entry.word}"
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(13, 27, 42, 0.3);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 245, 0.3);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 245, 0.5);
        }
      `}</style>
    </div>
  );
}
