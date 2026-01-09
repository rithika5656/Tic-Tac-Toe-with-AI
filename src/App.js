import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { findBestMove, isGameOver, getWinner, HUMAN, AI, EMPTY } from './minimax';

// Theme configurations
const themes = {
  purple: {
    name: 'Purple Dream',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#9f7aea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0077b6',
    secondary: '#00b4d8',
    accent: '#48cae4',
    gradient: 'linear-gradient(135deg, #023e8a 0%, #0077b6 50%, #00b4d8 100%)'
  },
  sunset: {
    name: 'Sunset Glow',
    primary: '#f72585',
    secondary: '#7209b7',
    accent: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 100%)'
  },
  forest: {
    name: 'Forest Green',
    primary: '#2d6a4f',
    secondary: '#40916c',
    accent: '#52b788',
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)'
  },
  dark: {
    name: 'Dark Mode',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)'
  },
  neon: {
    name: 'Neon Nights',
    primary: '#00ff88',
    secondary: '#00d4ff',
    accent: '#ff00ff',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)'
  }
};

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(EMPTY).map(() => Array(3)));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState('hard');
  const [theme, setTheme] = useState('purple');
  const [clickedSquare, setClickedSquare] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particles, setParticles] = useState([]);

  // Apply theme CSS variables
  useEffect(() => {
    const currentTheme = themes[theme];
    document.documentElement.style.setProperty('--primary-color', currentTheme.primary);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.secondary);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accent);
    document.documentElement.style.setProperty('--gradient', currentTheme.gradient);
    document.documentElement.style.setProperty('--is-dark', theme === 'dark' || theme === 'neon' ? '1' : '0');
  }, [theme]);

  // Sound effects
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'click':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'win':
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'lose':
        oscillator.frequency.value = 400;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'draw':
        oscillator.frequency.value = 440;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      default:
        break;
    }
  }, [soundEnabled]);

  // Create particle explosion effect
  const createParticles = (x, y, color) => {
    const newParticles = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color,
        angle: (i / 12) * 360,
        speed: Math.random() * 3 + 2
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

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
      setClickedSquare(`${bestMove.row}-${bestMove.col}`);
      setTimeout(() => setClickedSquare(null), 300);

      // Check if game is over
      if (isGameOver(newBoard)) {
        const gameWinner = getWinner(newBoard);
        setWinner(gameWinner);
        setGameOver(true);

        // Update stats and play sound
        if (gameWinner === HUMAN) {
          setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
          playSound('win');
        } else if (gameWinner === AI) {
          setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
          playSound('lose');
        } else {
          setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
          playSound('draw');
        }
      } else {
        setIsHumanTurn(true);
      }
    }
  };

  const handleSquareClick = (row, col, event) => {
    if (!isHumanTurn || gameOver || board[row][col] !== EMPTY) {
      return;
    }

    // Create particle effect at click position
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createParticles(x, y, themes[theme].primary);
    
    // Play click sound
    playSound('click');
    
    // Set clicked animation
    setClickedSquare(`${row}-${col}`);
    setTimeout(() => setClickedSquare(null), 300);

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = HUMAN;
    setBoard(newBoard);

    // Check if game is over
    if (isGameOver(newBoard)) {
      const gameWinner = getWinner(newBoard);
      setWinner(gameWinner);
      setGameOver(true);

      // Update stats and play sound
      if (gameWinner === HUMAN) {
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
        playSound('win');
      } else if (gameWinner === AI) {
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
        playSound('lose');
      } else {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
        playSound('draw');
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

  const handleButtonClick = (callback, event) => {
    playSound('click');
    
    // Create ripple effect
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    callback();
  };

  return (
    <div className={`app-container ${theme === 'dark' || theme === 'neon' ? 'dark-theme' : ''}`}>
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            '--angle': `${particle.angle}deg`,
            '--speed': particle.speed,
            backgroundColor: particle.color
          }}
        />
      ))}
      
      <div className="game-container">
        {/* Theme Selector */}
        <div className="theme-selector">
          <span className="theme-label">🎨 Theme:</span>
          <div className="theme-buttons">
            {Object.entries(themes).map(([key, value]) => (
              <button
                key={key}
                className={`theme-btn ${theme === key ? 'active' : ''}`}
                onClick={(e) => { playSound('click'); setTheme(key); }}
                title={value.name}
                style={{ background: value.gradient }}
              />
            ))}
          </div>
        </div>

        <h1>🎮 Tic-Tac-Toe</h1>
        <p className="subtitle">Play Against AI</p>

        {/* Sound Toggle */}
        <button 
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        <div className={`status ${getStatusClass()}`}>
          {getStatusMessage()}
        </div>

        <div className="board">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`square ${cell === HUMAN ? 'x' : cell === AI ? 'o' : ''} ${clickedSquare === `${i}-${j}` ? 'clicked' : ''}`}
                onClick={(e) => handleSquareClick(i, j, e)}
                disabled={gameOver || !isHumanTurn || cell !== EMPTY}
              >
                <span className="cell-content">{cell}</span>
              </button>
            ))
          )}
        </div>

        <div className="button-container">
          <button className="btn btn-primary" onClick={(e) => handleButtonClick(initializeBoard, e)}>
            <span className="btn-text">New Game</span>
          </button>
          <button className="btn btn-secondary" onClick={(e) => handleButtonClick(() => { setStats({ wins: 0, losses: 0, draws: 0 }); initializeBoard(); }, e)}>
            <span className="btn-text">Reset Stats</span>
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
