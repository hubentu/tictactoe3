import React from 'react';
import { Trophy, RotateCcw, History, Bot } from 'lucide-react';
import Board from './Board';
import { useGameContext } from '../context/GameContext';
import PlayerSetup from './PlayerSetup';
import GameHistory from './GameHistory';

const Game = () => {
  const {
    gameState,
    players,
    winner,
    isDraw,
    resetGame,
    showHistory,
    toggleHistory,
    playersSet,
    hasRobotOpponent,
  } = useGameContext();

  const getPlayerInstructions = (player: 'X' | 'O') => {
    if (player === 'X') {
      return "Can place X on | or neutralize O to |";
    }
    return "Can place O on | or neutralize X to |";
  };

  if (!playersSet) {
    return <PlayerSetup />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
          Three-State Tic Tac Toe
        </h1>
        <div className="flex justify-center gap-4 mb-4">
          <div className="bg-opacity-20 bg-white p-4 rounded-lg">
            <p className="font-semibold">{players.X}</p>
            <p className="text-pink-400">Player X</p>
            <p className="text-xs mt-1 opacity-75">{getPlayerInstructions('X')}</p>
          </div>
          <div className="bg-opacity-20 bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 justify-center">
              <p className="font-semibold">{players.O}</p>
              {hasRobotOpponent && <Bot size={16} className="text-violet-400" />}
            </div>
            <p className="text-violet-400">Player O</p>
            <p className="text-xs mt-1 opacity-75">{getPlayerInstructions('O')}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Board />
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset Game
            </button>
            <button
              onClick={toggleHistory}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              <History size={20} />
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {(winner || isDraw) && (
            <div className="bg-opacity-20 bg-white p-6 rounded-lg text-center animate-fade-in">
              {winner ? (
                <>
                  <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
                  <p className="text-2xl font-bold mb-2">
                    {players[winner]} Wins!
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold mb-2">It's a Draw!</p>
              )}
            </div>
          )}

          {!winner && !isDraw && (
            <div className="bg-opacity-20 bg-white p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl">
                  Current Turn: {players[gameState.currentPlayer]}
                </p>
                {hasRobotOpponent && gameState.currentPlayer === 'O' && (
                  <Bot size={20} className="text-violet-400 animate-pulse" />
                )}
              </div>
              <p className="text-sm mt-2 opacity-75">
                {getPlayerInstructions(gameState.currentPlayer)}
              </p>
            </div>
          )}

          {showHistory && <GameHistory />}
        </div>
      </div>
    </div>
  );
};

export default Game;