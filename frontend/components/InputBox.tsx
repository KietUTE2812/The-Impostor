'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';

export default function InputBox() {
  const { submitWord, currentTurn, players, socket } = useGame();
  const [word, setWord] = useState('');

  const currentPlayer = players.find(p => p.socketId === currentTurn);
  const isMyTurn = currentTurn === socket?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && isMyTurn) {
      submitWord(word.trim());
      setWord('');
    }
  };

  return (
    <div 
      className="flex-[0.8] rounded-xl p-8 flex flex-col justify-between"
      style={{
        background: 'rgba(27, 38, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(157, 78, 221, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        minHeight: '500px'
      }}
    >
      {/* Current Turn Display */}
      <div className="text-center mb-8">
        <h3 
          className="text-2xl font-semibold mb-4"
          style={{
            fontFamily: "'Cinzel', serif",
            color: '#9D4EDD',
            letterSpacing: '1px'
          }}
        >
          <i className="fas fa-gamepad mr-3"></i>
          Current Turn
        </h3>
        
        <div 
          className="inline-flex items-center gap-4 px-8 py-4 rounded-xl"
          style={{
            background: isMyTurn 
              ? 'linear-gradient(135deg, rgba(0, 255, 245, 0.2), rgba(157, 78, 221, 0.2))'
              : 'rgba(13, 27, 42, 0.6)',
            border: isMyTurn 
              ? '2px solid rgba(0, 255, 245, 0.5)'
              : '2px solid rgba(119, 141, 169, 0.3)',
            boxShadow: isMyTurn 
              ? '0 0 30px rgba(0, 255, 245, 0.4)'
              : 'none',
            animation: isMyTurn ? 'turnPulse 2s ease-in-out infinite' : 'none'
          }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{
              border: '3px solid rgba(0, 255, 245, 0.5)',
              background: 'linear-gradient(135deg, rgba(0, 255, 245, 0.3), rgba(157, 78, 221, 0.3))',
              color: '#00FFF5'
            }}
          >
            <i className="fas fa-user"></i>
          </div>
          <div className="text-left">
            <div className="text-sm tracking-wide" style={{ color: '#778DA9', letterSpacing: '0.5px' }}>
              {isMyTurn ? 'YOUR TURN!' : 'WAITING FOR'}
            </div>
            <div 
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Philosopher', sans-serif",
                color: isMyTurn ? '#00FFF5' : '#E0E1DD',
                textShadow: isMyTurn ? '0 0 20px rgba(0, 255, 245, 0.6)' : 'none',
                letterSpacing: '1px'
              }}
            >
              {currentPlayer?.username || 'Waiting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            className="block text-sm font-semibold mb-3 tracking-wide"
            style={{ color: '#778DA9', letterSpacing: '0.5px' }}
          >
            ENTER YOUR WORD
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={!isMyTurn}
            placeholder={isMyTurn ? "Type your word..." : "Wait for your turn..."}
            className="w-full px-6 py-4 rounded-lg text-xl font-semibold tracking-wide transition-all duration-300 outline-none"
            style={{
              background: isMyTurn ? 'rgba(13, 27, 42, 0.8)' : 'rgba(13, 27, 42, 0.4)',
              border: isMyTurn 
                ? '2px solid rgba(0, 255, 245, 0.3)'
                : '2px solid rgba(119, 141, 169, 0.2)',
              color: isMyTurn ? '#E0E1DD' : '#778DA9',
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '0.5px',
              cursor: isMyTurn ? 'text' : 'not-allowed'
            }}
            onFocus={(e) => {
              if (isMyTurn) {
                e.target.style.borderColor = 'rgba(0, 255, 245, 0.6)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 245, 0.3)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 255, 245, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!isMyTurn || !word.trim()}
          className="w-full h-14 rounded-lg font-semibold text-xl tracking-wide cursor-pointer transition-all duration-300"
          style={{
            background: isMyTurn && word.trim()
              ? 'linear-gradient(135deg, #9D4EDD 0%, #00FFF5 100%)'
              : 'rgba(65, 90, 119, 0.5)',
            border: 'none',
            color: isMyTurn && word.trim() ? '#E0E1DD' : '#778DA9',
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: '1px',
            boxShadow: isMyTurn && word.trim()
              ? '0 0 30px rgba(0, 255, 245, 0.5)'
              : 'none',
            cursor: isMyTurn && word.trim() ? 'pointer' : 'not-allowed'
          }}
          onMouseEnter={(e) => {
            if (isMyTurn && word.trim()) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 245, 0.8)';
            }
          }}
          onMouseLeave={(e) => {
            if (isMyTurn && word.trim()) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 245, 0.5)';
            }
          }}
        >
          <i className="fas fa-paper-plane mr-2"></i>
          SUBMIT WORD
        </button>
      </form>

      {/* Hint */}
      {isMyTurn && (
        <div 
          className="mt-6 text-center text-sm leading-relaxed animate-pulse"
          style={{ color: '#778DA9', letterSpacing: '0.5px' }}
        >
          💡 Say a word related to the keyword to prove you're not the impostor!
        </div>
      )}

      <style jsx>{`
        @keyframes turnPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(0, 255, 245, 0.4);
          }
          50% { 
            box-shadow: 0 0 50px rgba(0, 255, 245, 0.7), 0 0 70px rgba(157, 78, 221, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
