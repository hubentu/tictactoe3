import React from 'react';
import { useGameContext } from '../context/GameContext';

const GameHistory = () => {
  const { history, players } = useGameContext();

  const getMoveDescription = (from: string, to: string) => {
    if (from === '|') {
      return `placed ${to}`;
    }
    return `neutralized ${from}`;
  };

  return (
    <div className="bg-opacity-20 bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Game History</h3>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p>No moves yet</p>
        ) : (
          history.map((move, index) => (
            <div
              key={index}
              className="p-2 bg-black bg-opacity-20 rounded flex justify-between items-center"
            >
              <span>
                {players[move.player]} {getMoveDescription(move.from, move.to)} at position{' '}
                {move.position + 1}
              </span>
              <span className="text-sm opacity-75">Move {index + 1}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;