'use client';

import { useGame } from '@/contexts/GameContext';

interface ResultsScreenProps {
  onPlayAgain?: () => void;
  onReturnToLobby?: () => void;
}

export default function ResultsScreen({ onPlayAgain, onReturnToLobby }: ResultsScreenProps) {
  const { gameResult, players, keyword, playAgain } = useGame();

  if (!gameResult) return null;

  const votedPlayer = players.find(p => p.socketId === gameResult.votedOutPlayer?.socketId);
  const isImpostorWin = gameResult.winner === 'impostor';

  const handlePlayAgain = () => {
    playAgain();
    if (onPlayAgain) onPlayAgain();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <div 
        className="max-w-4xl w-full px-8 text-center"
        style={{ animation: 'fadeInUp 0.8s ease-out' }}
      >
        {/* Winner Announcement */}
        <div 
          className="mb-8 inline-flex items-center justify-center w-32 h-32 rounded-full text-7xl"
          style={{
            background: isImpostorWin 
              ? 'linear-gradient(135deg, #FF6B9D 0%, #9D4EDD 100%)'
              : 'linear-gradient(135deg, #00FFF5 0%, #9D4EDD 100%)',
            boxShadow: isImpostorWin
              ? '0 0 80px rgba(255, 107, 157, 0.8), 0 0 120px rgba(157, 78, 221, 0.6)'
              : '0 0 80px rgba(0, 255, 245, 0.8), 0 0 120px rgba(157, 78, 221, 0.6)',
            animation: 'resultPulse 2s ease-in-out infinite'
          }}
        >
          {isImpostorWin ? '🎭' : '✨'}
        </div>

        <h1 
          className="text-7xl font-bold mb-6"
          style={{
            fontFamily: "'Cinzel', serif",
            color: isImpostorWin ? '#FF6B9D' : '#00FFF5',
            textShadow: isImpostorWin
              ? '0 0 50px rgba(255, 107, 157, 0.8)'
              : '0 0 50px rgba(0, 255, 245, 0.8)',
            letterSpacing: '3px',
            animation: 'logoGlow 2s ease-in-out infinite'
          }}
        >
          {isImpostorWin ? 'IMPOSTOR WINS!' : 'CREWMATES WIN!'}
        </h1>

        {/* Voted Player Info */}
        <div 
          className="mb-8 p-8 rounded-xl inline-block"
          style={{
            background: 'rgba(27, 38, 59, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 245, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="text-lg tracking-wide mb-4" style={{ color: '#778DA9', letterSpacing: '1px' }}>
            VOTED OUT
          </div>
          
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
            style={{
              border: '3px solid rgba(255, 107, 157, 0.5)',
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(157, 78, 221, 0.3))',
              boxShadow: '0 0 30px rgba(255, 107, 157, 0.4)'
            }}
          >
            <i className="fas fa-user"></i>
          </div>

          <div 
            className="text-4xl font-bold mb-3"
            style={{
              fontFamily: "'Philosopher', sans-serif",
              color: '#E0E1DD',
              letterSpacing: '1px'
            }}
          >
            {votedPlayer?.username || 'Unknown'}
          </div>

          <div 
            className="text-2xl font-semibold px-6 py-2 rounded-full inline-block"
            style={{
              background: gameResult.isImpostor 
                ? 'rgba(255, 107, 157, 0.2)'
                : 'rgba(0, 255, 245, 0.2)',
              color: gameResult.isImpostor ? '#FF6B9D' : '#00FFF5',
              border: gameResult.isImpostor 
                ? '2px solid rgba(255, 107, 157, 0.5)'
                : '2px solid rgba(0, 255, 245, 0.5)',
              letterSpacing: '1px'
            }}
          >
            {gameResult.isImpostor ? '🎭 WAS THE IMPOSTOR' : '✨ WAS A CREWMATE'}
          </div>
        </div>

        {/* Keyword Reveal */}
        <div 
          className="mb-10 p-8 rounded-xl inline-block"
          style={{
            background: 'rgba(27, 38, 59, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 245, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="text-lg tracking-wide mb-3" style={{ color: '#778DA9', letterSpacing: '1px' }}>
            THE SECRET KEYWORD WAS
          </div>
          <div 
            className="text-6xl font-bold"
            style={{
              fontFamily: "'Philosopher', sans-serif",
              color: '#00FFF5',
              textShadow: '0 0 40px rgba(0, 255, 245, 0.8)',
              letterSpacing: '2px'
            }}
          >
            {keyword}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={handlePlayAgain}
            className="h-16 px-10 rounded-lg font-semibold text-xl cursor-pointer transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #9D4EDD 0%, #00FFF5 100%)',
              border: 'none',
              color: '#E0E1DD',
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '1px',
              boxShadow: '0 0 30px rgba(0, 255, 245, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 245, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 245, 0.5)';
            }}
          >
            <i className="fas fa-redo mr-3"></i>
            PLAY AGAIN
          </button>

          {/* <button
            onClick={onReturnToLobby}
            className="h-16 px-10 rounded-lg font-semibold text-xl cursor-pointer transition-all duration-300"
            style={{
              background: 'transparent',
              border: '2px solid #FF6B9D',
              color: '#FF6B9D',
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF6B9D';
              e.currentTarget.style.color = '#0D1B2A';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 107, 157, 0.5)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FF6B9D';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <i className="fas fa-home mr-3"></i>
            RETURN TO LOBBY
          </button> */}
        </div>

        {/* Fun Message */}
        <div 
          className="mt-8 text-xl leading-relaxed"
          style={{
            fontFamily: "'Raleway', sans-serif",
            color: '#778DA9',
            letterSpacing: '0.5px'
          }}
        >
          {isImpostorWin 
            ? "The impostor deceived everyone and escaped! Better luck next time, crewmates."
            : "The crewmates successfully identified and ejected the impostor! Well done, detectives!"
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes resultPulse {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
