'use client';

import { useGame } from '@/contexts/GameContext';
import RoleDisplay from './RoleDisplay';
import WordHistory from './WordHistory';
import InputBox from './InputBox';
import VotingScreen from './VotingScreen';
import ResultsScreen from './ResultsScreen';

interface GameScreenProps {
  onGameEnd: () => void;
}

export default function GameScreen({ onGameEnd }: GameScreenProps) {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <RoleDisplay />
      
      {gameState === 'PLAYING' && (
        <>
          <WordHistory />
          <InputBox />
        </>
      )}

      {gameState === 'VOTING' && (
        <>
          <WordHistory />
          <VotingScreen />
        </>
      )}

      {gameState === 'RESULT' && (
        <ResultsScreen onPlayAgain={onGameEnd} />
      )}
    </div>
  );
}
