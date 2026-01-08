import React, { useState, useEffect } from 'react';
import './App.css';
import { findBestMove, isGameOver, getWinner, HUMAN, AI, EMPTY } from './minimax';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(EMPTY).map(() => Array(3)));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState('hard');

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Create a proper 3x3 board
  const createEmptyBoard = () => {
    return [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY]
    ];
  };

  const initializeBoard = () => {
    setBoard(createEmptyBoard());
    setIsHumanTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  // AI move with delay
  useEffect(() => {
    if (!isHumanTurn && !gameOver) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, gameOver]);

  const makeAIMove = () => {
    const boardCopy = board.map(row => [...row]);
    const bestMove = findBestMove(boardCopy);

    if (bestMove) {
      const newBoard = board.map(row => [...row]);
      newBoard[bestMove.row][bestMove.col] = AI;
      setBoard(newBoard);

      // Check if game is over
      if (isGameOver(newBoard)) {
        const gameWinner = getWinner(newBoard);
        setWinner(gameWinner);
        setGameOver(true);

        // Update stats
        if (gameWinner === HUMAN) {
          setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
        } else if (gameWinner === AI) {
          setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
        } else {
          setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
        }
      } else {
        setIsHumanTurn(true);
      }
    }
  };

  const handleSquareClick = (row, col) => {
    if (!isHumanTurn || gameOver || board[row][col] !== EMPTY) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = HUMAN;
    setBoard(newBoard);

    // Check if game is over
    if (isGameOver(newBoard)) {
      const gameWinner = getWinner(newBoard);
      setWinner(gameWinner);
      setGameOver(true);

      // Update stats
      if (gameWinner === HUMAN) {
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else if (gameWinner === AI) {
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
      } else {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsHumanTurn(false);
    }
  };

  const getStatusMessage = () => {
    if (!gameOver) {
      return isHumanTurn ? 'Your Turn (X)' : 'AI is thinking...';
    }

    switch (winner) {
      case HUMAN:
        return '🎉 You Won!';
      case AI:
        return '🤖 AI Won!';
      case 'draw':
        return "It's a Draw!";
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    if (!gameOver) return '';
    if (winner === HUMAN) return 'winner';
    if (winner === AI) return 'loser';
    if (winner === 'draw') return 'draw';
    return '';
  };

  return (
    <div className="app-container">
      <div className="game-container">
        <h1>🎮 Tic-Tac-Toe</h1>
        <p className="subtitle">Play Against AI</p>

        <div className={`status ${getStatusClass()}`}>
          {getStatusMessage()}
        </div>

        <div className="board">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`square ${cell === HUMAN ? 'x' : cell === AI ? 'o' : ''}`}
                onClick={() => handleSquareClick(i, j)}
                disabled={gameOver || !isHumanTurn || cell !== EMPTY}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        <div className="button-container">
          <button className="btn btn-primary" onClick={initializeBoard}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={() => { setStats({ wins: 0, losses: 0, draws: 0 }); initializeBoard(); }}>
            Reset Stats
          </button>
        </div>

        <div className="stats">
          <div className="stat-row">
            <span className="stat-label">Your Wins:</span>
            <span className="stat-value">{stats.wins}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">AI Wins:</span>
            <span className="stat-value">{stats.losses}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Draws:</span>
            <span className="stat-value">{stats.draws}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
