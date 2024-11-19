import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <Game />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;