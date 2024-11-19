import React from 'react';
import { useGameContext } from '../context/GameContext';

const Board = () => {
  const { gameState, makeMove, isValidMove } = useGameContext();

  const getCellStyle = (value: string | null, position: number) => {
    const baseStyle = `
      h-24 md:h-32 bg-opacity-20 bg-white rounded-lg text-4xl font-bold
      transition-all duration-200 transform
      disabled:hover:scale-100
    `;

    const isValid = isValidMove(position);
    
    if (value === 'X') {
      return `${baseStyle} text-pink-400 ${isValid ? 'hover:scale-105 hover:bg-opacity-30' : 'opacity-50'}`;
    }
    if (value === 'O') {
      return `${baseStyle} text-violet-400 ${isValid ? 'hover:scale-105 hover:bg-opacity-30' : 'opacity-50'}`;
    }
    return `${baseStyle} text-gray-400 ${isValid ? 'hover:scale-105 hover:bg-opacity-30' : 'opacity-50'}`;
  };

  return (
    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
      {gameState.board.map((value, index) => (
        <button
          key={index}
          onClick={() => makeMove(index)}
          disabled={!isValidMove(index) || gameState.winner !== null}
          className={getCellStyle(value, index)}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default Board;