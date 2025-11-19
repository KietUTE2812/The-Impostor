'use client';

import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import Lobby from '@/components/Lobby';
import Room from '@/components/Room';
import GameScreen from '@/components/GameScreen';
import ErrorModal from '@/components/ErrorModal';

// Background component with animated starfield
function Background() {
  return (
    <div className="background">
    </div>
  );
}

// Animated particles
function Particles() {
  const [particles, setParticles] = useState<{ left: string; top: string; animationDelay: string; animationDuration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration
          }}
        ></div>
      ))}
    </div>
  );
}

// Decorative orbs
function DecorativeOrbs() {
  return (
    <>
      <div className="decorative-orb orb-1"></div>
      <div className="decorative-orb orb-2"></div>
      <div className="decorative-orb orb-3"></div>
    </>
  );
}

// Main game content wrapper
function GameContent() {
  const { roomId, gameState, leaveRoom, errorMessage, setErrorMessage } = useGame();
  const [view, setView] = useState<'lobby' | 'room' | 'game'>('lobby');

  useEffect(() => {
    console.log('roomId:', roomId, 'gameState:', gameState);
    if (roomId && gameState === 'LOBBY') {
      setView('room');
    } else if (gameState && gameState !== 'LOBBY') {
      setView('game');
    } else if (!roomId) {
      setView('lobby');
    }
  }, [roomId, gameState]);

  const handleJoinedRoom = () => {
    setView('room');
  };

  const handleStartGame = () => {
    setView('game');
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setView('lobby');
  };

  if (errorMessage) {
    return <ErrorModal message={errorMessage} onClose={() => {
      setErrorMessage(null);
      if (!roomId) {
        setView('lobby');
      }
      else if (gameState !== 'LOBBY') {setView('room');}
    }} />;
  }

  return (
    <>
      {view === 'lobby' && <Lobby onJoined={handleJoinedRoom} />}
      {view === 'room' && <Room onStartGame={handleStartGame} onLeave={handleLeaveRoom} />}
      {view === 'game' && <GameScreen />}
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <main className="main-container">
        <Background />
        <Particles />
        <DecorativeOrbs />
        <GameContent />
      </main>
    </GameProvider>
  );
}
