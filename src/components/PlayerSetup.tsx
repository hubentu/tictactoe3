import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Bot, Users } from 'lucide-react';

const PlayerSetup = () => {
  const { setPlayers } = useGameContext();
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [isRobotOpponent, setIsRobotOpponent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerX.trim() && (isRobotOpponent || playerO.trim())) {
      setPlayers(playerX, playerO, isRobotOpponent);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Game Setup</h2>
      
      <div className="mb-6">
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsRobotOpponent(false)}
            className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 transition-all ${
              !isRobotOpponent
                ? 'bg-violet-600 ring-2 ring-violet-400'
                : 'bg-white bg-opacity-10 hover:bg-opacity-20'
            }`}
          >
            <Users size={24} />
            <span>Human vs Human</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRobotOpponent(true)}
            className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 transition-all ${
              isRobotOpponent
                ? 'bg-violet-600 ring-2 ring-violet-400'
                : 'bg-white bg-opacity-10 hover:bg-opacity-20'
            }`}
          >
            <Bot size={24} />
            <span>Play vs Robot</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Player X (You)</label>
          <input
            type="text"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
            className="w-full p-2 rounded bg-white bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your name"
            required
          />
        </div>
        
        {!isRobotOpponent && (
          <div>
            <label className="block mb-2">Player O</label>
            <input
              type="text"
              value={playerO}
              onChange={(e) => setPlayerO(e.target.value)}
              className="w-full p-2 rounded bg-white bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter opponent's name"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-violet-600 rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup;