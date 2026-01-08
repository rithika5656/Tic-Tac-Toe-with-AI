// Minimax algorithm for Tic-Tac-Toe AI

const HUMAN = 'X';
const AI = 'O';
const EMPTY = null;

// Evaluate the board state
function evaluate(board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== EMPTY && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0] === AI ? 10 : -10;
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (board[0][j] !== EMPTY && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      return board[0][j] === AI ? 10 : -10;
    }
  }

  // Check diagonals
  if (board[0][0] !== EMPTY && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0] === AI ? 10 : -10;
  }

  if (board[0][2] !== EMPTY && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2] === AI ? 10 : -10;
  }

  return 0; // No winner
}

// Check if there are any empty cells
function isMovesLeft(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === EMPTY) {
        return true;
      }
    }
  }
  return false;
}

// Minimax function with alpha-beta pruning
function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
  const score = evaluate(board);

  // Terminal node - AI wins
  if (score === 10) {
    return score - depth;
  }

  // Terminal node - Human wins
  if (score === -10) {
    return score + depth;
  }

  // No more moves - Draw
  if (!isMovesLeft(board)) {
    return 0;
  }

  if (isMaximizing) {
    // AI is trying to maximize score
    let maxEval = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === EMPTY) {
          board[i][j] = AI;
          const eval_score = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = EMPTY;
          maxEval = Math.max(maxEval, eval_score);
          alpha = Math.max(alpha, eval_score);
          if (beta <= alpha) break; // Beta cutoff
        }
      }
    }
    return maxEval;
  } else {
    // Human is trying to minimize score
    let minEval = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === EMPTY) {
          board[i][j] = HUMAN;
          const eval_score = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = EMPTY;
          minEval = Math.min(minEval, eval_score);
          beta = Math.min(beta, eval_score);
          if (beta <= alpha) break; // Alpha cutoff
        }
      }
    }
    return minEval;
  }
}

// Find the best move for AI
export function findBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === EMPTY) {
        board[i][j] = AI;
        const score = minimax(board, 0, false);
        board[i][j] = EMPTY;

        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: i, col: j };
        }
      }
    }
  }

  return bestMove;
}

// Check if the game is over
export function isGameOver(board) {
  // Check for winner
  const winner = evaluate(board);
  if (winner !== 0) {
    return true;
  }

  // Check for draw
  return !isMovesLeft(board);
}

// Get winner status
export function getWinner(board) {
  const score = evaluate(board);
  if (score === 10) return AI;
  if (score === -10) return HUMAN;
  if (!isMovesLeft(board)) return 'draw';
  return null;
}

export { HUMAN, AI, EMPTY };
