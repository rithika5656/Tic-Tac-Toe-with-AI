# Tic-Tac-Toe with AI

A React-based Tic-Tac-Toe game where you play against an AI opponent powered by the minimax algorithm.

## Features

- **Intelligent AI**: Uses the minimax algorithm with alpha-beta pruning for optimal gameplay
- **Unbeatable AI**: The AI plays optimally and is nearly impossible to beat
- **Game Statistics**: Track your wins, losses, and draws
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beautiful UI**: Modern and interactive user interface with smooth animations

## How to Play

1. You are **X** and the AI is **O**
2. Click on any empty square to make your move
3. The AI will automatically make its move after you
4. Win by getting three in a row (horizontally, vertically, or diagonally)
5. Click "New Game" to start a fresh game

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rithika5656/Tic-Tac-Toe-with-AI.git
cd Tic-Tac-Toe-with-AI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

## Algorithm Explanation

### Minimax Algorithm
The AI uses the minimax algorithm, a recursive decision-making algorithm that:
- **Maximizing**: When it's the AI's turn, it looks for the move with the highest score
- **Minimizing**: When it's the opponent's turn, it looks for the move with the lowest score
- **Scoring**: Winning = +10, Losing = -10, Draw = 0

### Alpha-Beta Pruning
Optimizes the minimax algorithm by:
- Eliminating branches that cannot influence the final decision
- Reducing the number of nodes evaluated
- Significantly improving performance

## File Structure

```
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Styling
│   ├── minimax.js          # AI algorithm logic
│   └── index.js            # React entry point
├── package.json            # Project dependencies
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

## Technologies Used

- **React 18**: UI library
- **JavaScript ES6+**: Programming language
- **CSS3**: Styling with animations

## Performance

The minimax algorithm with alpha-beta pruning can evaluate all possible game states very quickly:
- Initial state: ~362,880 possible games
- With pruning: Typically evaluates <10,000 nodes
- AI move time: Usually <1 second

## Future Enhancements

- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Game history/replay feature
- [ ] Multiplayer mode
- [ ] Sound effects
- [ ] Dark mode
- [ ] PWA support

## License

This project is open source and available under the MIT License.

## Author

Created by [Rithika](https://github.com/rithika5656)

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Enjoy the game and see if you can beat the AI! 🎮**
