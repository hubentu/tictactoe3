import React, { createContext, useContext, useState, useEffect } from 'react';
import { CellState, Players, GameState, Move } from '../types';
import { RobotPlayer } from '../services/RobotPlayer';

interface GameContextType {
  gameState: GameState;
  players: Players;
  history: Move[];
  winner: string | null;
  isDraw: boolean;
  playersSet: boolean;
  showHistory: boolean;
  makeMove: (position: number) => void;
  resetGame: () => void;
  setPlayers: (playerX: string, playerO: string, robotOpponent?: boolean) => void;
  toggleHistory: () => void;
  isValidMove: (position: number) => boolean;
  hasRobotOpponent: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  board: Array(9).fill('|'),
  currentPlayer: 'X',
  winner: null,
  lastMove: null,
};

const robotPlayer = new RobotPlayer();

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [players, setPlayersState] = useState<Players>({ X: '', O: '' });
  const [history, setHistory] = useState<Move[]>([]);
  const [playersSet, setPlayersSet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hasRobotOpponent, setHasRobotOpponent] = useState(false);

  const checkWinner = (board: CellState[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (
        board[a] &&
        board[a] !== '|' &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }
    return null;
  };

  const isValidMove = (position: number): boolean => {
    const currentCell = gameState.board[position];
    
    if (position === gameState.lastMove) {
      return false;
    }

    if (gameState.currentPlayer === 'X') {
      return currentCell === '|' || currentCell === 'O';
    } else {
      return currentCell === '|' || currentCell === 'X';
    }
  };

  const getNextState = (currentState: CellState, player: 'X' | 'O'): CellState => {
    if (currentState === '|') {
      return player;
    }
    return '|';
  };

  const makeMove = (position: number) => {
    if (!isValidMove(position) || gameState.winner) {
      return;
    }

    const currentState = gameState.board[position];
    const nextState = getNextState(currentState, gameState.currentPlayer);
    const newBoard = [...gameState.board];
    newBoard[position] = nextState;

    const winner = checkWinner(newBoard);
    const newHistory = [...history, {
      player: gameState.currentPlayer,
      position,
      from: currentState,
      to: nextState
    }];

    setHistory(newHistory);
    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      lastMove: position
    });
  };

  // Handle robot moves
  useEffect(() => {
    // Execute robot move when it's O's turn
    if (hasRobotOpponent && gameState.currentPlayer === 'O' && !gameState.winner) {
      const robotMove = robotPlayer.getBestMove(gameState.board, gameState.lastMove);
      console.log('Robot selected move:', robotMove);
      
      if (robotMove >= 0) {
        // Add a small delay to make the move feel more natural
        setTimeout(() => {
          makeMove(robotMove);
        }, 500);
      }
    }
  }, [gameState.currentPlayer, gameState.winner]);

  const resetGame = () => {
    setGameState(initialGameState);
    setHistory([]);
  };

  const setPlayers = (playerX: string, playerO: string, robotOpponent = false) => {
    setPlayersState({ X: playerX, O: robotOpponent ? '🤖 Robot' : playerO });
    setPlayersSet(true);
    setHasRobotOpponent(robotOpponent);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const isDraw = false;

  return (
    <GameContext.Provider
      value={{
        gameState,
        players,
        history,
        winner: gameState.winner,
        isDraw,
        playersSet,
        showHistory,
        makeMove,
        resetGame,
        setPlayers,
        toggleHistory,
        isValidMove,
        hasRobotOpponent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};