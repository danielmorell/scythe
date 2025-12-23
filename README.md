# 🎮 Scythe Board Game AI

A strategic board game AI implementation inspired by the popular Scythe board game from Stonemaier Games. Built with React.js featuring an intelligent AI opponent and a beautiful, intuitive user interface.

![Start Screen](https://github.com/user-attachments/assets/72f48040-3807-4f4f-ac9a-428f99628359)

## ✨ Features

- 🤖 **Intelligent AI Opponent** - Play against an AI with three difficulty levels (Easy, Medium, Hard)
- 💡 **Action Recommendations** - Get strategic suggestions for the best moves
- 📊 **Real-time Resource Management** - Track coins, power, popularity, and resources
- 🗺️ **Visual Game Board** - Interactive 9x9 grid with different terrain types
- 📝 **Complete Game Log** - View all actions taken by both players
- 🎯 **Turn-based Gameplay** - Strategic decision-making each turn
- 🏆 **Score Tracking** - Real-time score calculation for both players

## 🎯 Game Overview

In Scythe, you compete against an AI opponent to accumulate the highest score by managing resources, expanding territory, and making strategic decisions. The game features:

- **Factions**: Choose from multiple factions (Polania, Rusviet, Nordic, Saxony, Crimea)
- **Resources**: Manage coins, wood, food, metal, oil, power, and popularity
- **Actions**: Produce resources, trade, bolster your forces, build structures, and move units
- **Victory**: Earn points through coins, stars, buildings, and popularity

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/danielmorell/scythe.git
cd scythe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Play

![Game Screen](https://github.com/user-attachments/assets/bb1af06c-5760-471b-9487-7658096fa128)

1. **Select Difficulty**: Choose Easy, Medium, or Hard AI difficulty
2. **Your Turn**: Select from available actions (Produce, Trade, Bolster, Build)
3. **AI Turn**: Watch the AI make its strategic move
4. **Track Progress**: Monitor resources, scores, and game log
5. **Get Help**: Enable recommendations to see the best action suggestions

![Recommendations](https://github.com/user-attachments/assets/0cd6cd18-8c4e-40e3-bf00-99b1d3cf1a58)

### Available Actions

- **🏭 Produce**: Gain 2 Wood and 1 Food (Cost: 1 Coin)
- **🤝 Trade**: Convert 2 Wood to 3 Coins (Cost: 2 Wood)
- **💪 Bolster**: Gain 2 Power and 1 Popularity (Cost: 1 Coin)
- **🏗️ Build**: Construct a building (Cost: 3 Wood, 2 Coins)

![Gameplay](https://github.com/user-attachments/assets/b8bfea54-7d69-438a-b066-8587f6947ba8)

## 🧠 AI Strategy

The AI uses an evaluation system that considers:

- Resource values and economy
- Strategic positioning on the board
- Building and expansion opportunities
- Power and popularity balance
- Distance to key locations (e.g., factory)

The AI difficulty affects:
- **Easy**: Makes somewhat random choices with simple evaluation
- **Medium**: Balanced strategy with 2-step lookahead
- **Hard**: Advanced strategy with 3-step lookahead and optimal decision-making

## 🏗️ Project Structure

```
scythe/
├── src/
│   ├── game/
│   │   ├── gameState.js      # Game state management and logic
│   │   └── ai.js              # AI decision-making algorithms
│   ├── components/
│   │   ├── PlayerDashboard.jsx    # Player resource display
│   │   ├── ActionPanel.jsx        # Action selection interface
│   │   ├── GameBoard.jsx          # Visual game board
│   │   └── GameLog.jsx            # Game history log
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── public/                    # Static assets
└── package.json              # Project dependencies
```

## 🛠️ Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling with gradients and animations

## 📝 Development

### Linting

```bash
npm run lint
```

### Code Structure

The game is built with a clean separation of concerns:

- **Game Logic** (`src/game/`): Pure JavaScript functions for game state and AI
- **UI Components** (`src/components/`): Reusable React components
- **State Management**: React hooks for local state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎲 About Scythe

This is a fan-made digital implementation inspired by Scythe, a board game designed by Jamey Stegmaier and published by Stonemaier Games. This project is not affiliated with or endorsed by Stonemaier Games.

## 🙏 Acknowledgments

- Inspired by the board game Scythe by Jamey Stegmaier
- Built with modern web technologies for an engaging gaming experience
