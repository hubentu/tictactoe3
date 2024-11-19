import { CellState } from '../types';

interface Position {
  score: number;
  position: number;
  fCost?: number;
  gCost?: number;
  hCost?: number;
  parent?: Position;
}

export class RobotPlayer {
  private readonly WIN_SCORE = 1000;
  private readonly MAX_DEPTH = 6;  // Changed from 4 to 6

  private isWinningState(board: CellState[], player: 'X' | 'O'): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return lines.some(line => 
      line.every(pos => board[pos] === player)
    );
  }

  private getHeuristicCost(board: CellState[], position: number, player: 'X' | 'O'): number {
    const opponent = player === 'O' ? 'X' : 'O';
    const nextBoard = [...board];
    nextBoard[position] = player;
    
    let hCost = 0;
    
    // Check for immediate win
    if (this.isWinningState(nextBoard, player)) {
        return this.WIN_SCORE;
    }

    // Improved blocking logic
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // First, check for immediate threats
    for (const line of lines) {
        if (!line.includes(position)) continue;

        const lineStates = line.map(pos => board[pos]);
        const xCount = lineStates.filter(state => state === 'X').length;
        
        // Higher priority for blocking two X's
        if (xCount === 2) {
            const emptyInLine = line.find(pos => board[pos] === '|');
            if (emptyInLine === position) {
                return this.WIN_SCORE - 1; // Critical blocking move
            }
            // If we can neutralize an X in a threatening line
            if (board[position] === 'X') {
                return this.WIN_SCORE - 2; // Very high priority for neutralizing
            }
        }
    }

    // Enhanced scoring for potential threats and opportunities
    for (const line of lines) {
        if (!line.includes(position)) continue;

        const lineStates = line.map(pos => nextBoard[pos]);
        const playerCount = lineStates.filter(state => state === player).length;
        const opponentCount = lineStates.filter(state => state === opponent).length;
        const emptyCount = lineStates.filter(state => state === '|').length;

        // Improved weights for different scenarios
        if (playerCount === 2 && emptyCount === 1) hCost += 15;
        else if (opponentCount === 2 && emptyCount === 1) hCost += 14;
        else if (playerCount === 1 && emptyCount === 2) hCost += 5;
        else if (opponentCount === 1 && emptyCount === 2) hCost += 4;
        
        // Bonus for neutralizing opponent's pieces in strategic positions
        if (board[position] === opponent) hCost += 3;
    }

    // Adjusted strategic position weights
    if (position === 4) hCost += 5; // Center is more important
    else if ([0, 2, 6, 8].includes(position)) hCost += 3; // Corners are valuable
    else hCost += 1; // Edges

    return hCost;
  }

  private getValidMoves(board: CellState[], player: 'X' | 'O', lastMove: number | null): Position[] {
    const validMoves: Position[] = [];

    for (let i = 0; i < board.length; i++) {
      // Skip the last move position
      if (i === lastMove) {
        continue;
      }

      const cell = board[i];
      // For O: can use ANY position except where O already exists and last move
      // For X: can only use empty cells
      if (player === 'O' ? (cell !== 'O' && i !== lastMove) : cell === '|') {
        const positionScore = 
          i === 4 ? 3 : // Center
          [0, 2, 6, 8].includes(i) ? 2 : // Corners
          1; // Edges

        validMoves.push({
          position: i,
          score: positionScore,
          gCost: positionScore,
          hCost: this.getHeuristicCost(board, i, player),
          fCost: positionScore + this.getHeuristicCost(board, i, player)
        });
      }
    }

    console.log('Valid moves with scores (excluding last move):', validMoves);
    return validMoves;
  }

  private minimax(
    board: CellState[],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    lastMove: number | null
  ): { score: number; position: number } {
    const player = isMaximizing ? 'O' : 'X';
    
    // Terminal conditions
    if (this.isWinningState(board, 'O')) return { score: this.WIN_SCORE, position: -1 };
    if (this.isWinningState(board, 'X')) return { score: -this.WIN_SCORE, position: -1 };
    if (depth === 0) {
      return { 
        score: this.getHeuristicCost(board, lastMove || 0, 'O'),
        position: -1 
      };
    }

    const validMoves = this.getValidMoves(board, player, lastMove);
    if (validMoves.length === 0) return { score: 0, position: -1 };

    let bestMove = -1;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of validMoves) {
      const newBoard = [...board];
      newBoard[move.position] = player;
      
      const score = this.minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        !isMaximizing,
        move.position
      ).score;

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move.position;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move.position;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) break;  // Alpha-beta pruning
    }

    return { score: bestScore, position: bestMove };
  }

  getBestMove(board: CellState[], lastMove: number | null): number {
    const result = this.minimax(
      board,
      this.MAX_DEPTH,
      -Infinity,
      Infinity,
      true,
      lastMove
    );
    
    // If the best move is winning or blocking, return it directly
    if (Math.abs(result.score) >= this.WIN_SCORE - 1) {
      return result.position;
    }

    // Otherwise, get top moves and add some randomization
    const validMoves = this.getValidMoves(board, 'O', lastMove);
    validMoves.sort((a, b) => (b.fCost ?? 0) - (a.fCost ?? 0));
    const topMoves = validMoves.filter(
      move => (move.fCost ?? 0) >= (validMoves[0].fCost ?? 0) * 0.9
    );

    return topMoves[Math.floor(Math.random() * Math.min(3, topMoves.length))].position;
  }
}