# Three-State Tic Tac Toe

A unique twist on the classic Tic Tac Toe game where players can not only place their marks but also neutralize their opponent's marks.

![Game Screenshot]()

## 🎮 Game Rules

### Basic Mechanics
- The game is played on a 3x3 grid
- Two players take turns: X and O
- The goal is to create a line of three of your marks (horizontally, vertically, or diagonally)

### Unique Features
1. **Three States**: Each cell can be in one of three states:
   - X (Player X's mark)
   - O (Player O's mark)
   - | (Empty/Neutral state)

2. **Special Moves**:
   - Player X can:
     - Place X on an empty cell (|)
     - Neutralize an O back to |
   - Player O can:
     - Place O on an empty cell (|)
     - Neutralize an X back to |

### Winning Conditions
- Create a line of three of your marks (X or O)
- The game ends in a draw if no player achieves this

## 🤖 AI Opponent

The game features an intelligent robot opponent that:
- Uses minimax algorithm with alpha-beta pruning
- Implements strategic position evaluation
- Can both place marks and neutralize opponent's marks
- Adapts its strategy based on the game state
