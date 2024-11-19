export type CellState = 'X' | 'O' | '|' | null;

export interface Players {
  X: string;
  O: string;
}

export interface GameState {
  board: CellState[];
  currentPlayer: 'X' | 'O';
  winner: string | null;
  lastMove: number | null;
}

export interface Move {
  player: 'X' | 'O';
  position: number;
  from: CellState;
  to: CellState;
}