import { useState, useEffect } from 'react'
import './App.css'
import PlayerDashboard from './components/PlayerDashboard'
import ActionPanel from './components/ActionPanel'
import GameBoard from './components/GameBoard'
import GameLog from './components/GameLog'
import PlayerMat from './components/PlayerMat'
import { createInitialGameState, FACTIONS, ACTIONS, RESOURCES, applyAction, switchTurn, calculateScore, GameState, GameAction, ActionType, getAvailableActionColumns } from './game/gameState'
import { ScytheAI, getActionRecommendations, Difficulty, ActionRecommendation } from './game/ai'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ai, setAI] = useState<ScytheAI | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  // Calculate recommendations when needed
  const recommendations: ActionRecommendation[] = showRecommendations && gameState 
    ? getActionRecommendations(gameState) 
    : [];
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    if (gameState && gameState.currentPlayer === 'ai' && ai) {
      // AI takes its turn after a short delay
      const timer = setTimeout(() => {
        const aiAction = ai.chooseAction(gameState);
        // AI chooses random available column
        const availableColumns = getAvailableActionColumns(gameState.ai);
        const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        // Handle AI action inline to avoid dependency issues
        const newState = applyAction(gameState, 'ai', aiAction, randomColumn);
        const nextState = switchTurn(newState);
        setGameState(nextState);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, ai]);

  const startGame = (selectedDifficulty: Difficulty) => {
    const initialState = createInitialGameState(FACTIONS.POLANIA, FACTIONS.RUSVIET);
    setGameState(initialState);
    setAI(new ScytheAI(selectedDifficulty));
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setSelectedColumn(null);
  };

  const handlePlayerAction = (action: GameAction) => {
    if (!gameState || gameState.currentPlayer !== 'player' || selectedColumn === null) return;

    const newState = applyAction(gameState, 'player', action, selectedColumn);
    const nextState = switchTurn(newState);
    setGameState(nextState);
    setSelectedColumn(null); // Reset selection for next turn
  };
  
  const handleColumnSelect = (columnIndex: number) => {
    setSelectedColumn(columnIndex);
  };

  const canAfford = (actionType: ActionType): boolean => {
    if (!gameState) return false;
    const player = gameState.player;

    switch (actionType) {
      case ACTIONS.PRODUCE:
        return player.resources[RESOURCES.COIN] >= 1;
      case ACTIONS.TRADE:
        return player.resources[RESOURCES.WOOD] >= 2;
      case ACTIONS.BOLSTER:
        return player.resources[RESOURCES.COIN] >= 1;
      case ACTIONS.BUILD:
        return player.resources[RESOURCES.WOOD] >= 3 && player.resources[RESOURCES.COIN] >= 2;
      default:
        return true;
    }
  };

  const resetGame = () => {
    setGameState(null);
    setGameStarted(false);
    setShowRecommendations(false);
  };

  if (!gameStarted || !gameState) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>🎮 Scythe Board Game AI</h1>
          <p className="subtitle">Strategic board game with AI opponent</p>
        </header>

        <div className="start-screen">
          <div className="welcome-box">
            <h2>Welcome to Scythe!</h2>
            <p>
              Play against an AI opponent in this strategic board game. 
              Manage resources, expand your territory, and outmaneuver your opponent to victory!
            </p>
            
            <div className="difficulty-selection">
              <h3>Select AI Difficulty</h3>
              <div className="difficulty-buttons">
                <button 
                  className="difficulty-btn easy"
                  onClick={() => startGame('easy')}
                >
                  😊 Easy
                  <span className="difficulty-desc">Good for beginners</span>
                </button>
                <button 
                  className="difficulty-btn medium"
                  onClick={() => startGame('medium')}
                >
                  🎯 Medium
                  <span className="difficulty-desc">Balanced challenge</span>
                </button>
                <button 
                  className="difficulty-btn hard"
                  onClick={() => startGame('hard')}
                >
                  🔥 Hard
                  <span className="difficulty-desc">Expert level</span>
                </button>
              </div>
            </div>

            <div className="game-features">
              <h3>Features</h3>
              <ul>
                <li>🤖 Play against intelligent AI opponents</li>
                <li>💡 Get action recommendations</li>
                <li>📊 Track resources and stats in real-time</li>
                <li>🗺️ Visual game board</li>
                <li>📝 Complete game log</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 Scythe Board Game AI</h1>
        <div className="game-info">
          <span className="turn-indicator">
            Turn {gameState.currentTurn} - {gameState.currentPlayer === 'player' ? '👤 Your Turn' : '🤖 AI Turn'}
          </span>
          <span className="difficulty-badge">{difficulty.toUpperCase()}</span>
        </div>
      </header>

      <div className="game-controls">
        <button 
          className="control-btn"
          onClick={() => setShowRecommendations(!showRecommendations)}
        >
          {showRecommendations ? '❌ Hide' : '💡 Show'} Recommendations
        </button>
        <button className="control-btn reset" onClick={resetGame}>
          🔄 New Game
        </button>
      </div>

      {showRecommendations && recommendations.length > 0 && (
        <div className="recommendations-panel">
          <h3>💡 Recommended Actions</h3>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-item">
                <span className="rec-rank">#{idx + 1}</span>
                <span className="rec-description">{rec.description}</span>
                <span className="rec-score">Score: {rec.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="game-layout">
        <div className="left-column">
          <PlayerDashboard playerState={gameState.player} />
          <PlayerDashboard playerState={gameState.ai} isAI={true} />
          
          <div className="score-panel">
            <div className="score-item player-score">
              <span>Your Score</span>
              <span className="score-value">{calculateScore(gameState.player)}</span>
            </div>
            <div className="score-item ai-score">
              <span>AI Score</span>
              <span className="score-value">{calculateScore(gameState.ai)}</span>
            </div>
          </div>
        </div>

        <div className="right-column">
          <GameBoard 
            board={gameState.board} 
            playerPosition={gameState.player.position}
            aiPosition={gameState.ai.position}
          />
          
          {gameState.currentPlayer === 'player' && (
            <>
              <PlayerMat 
                playerState={gameState.player}
                onSelectColumn={handleColumnSelect}
                availableColumns={getAvailableActionColumns(gameState.player)}
              />
              {selectedColumn !== null && (
                <ActionPanel 
                  onAction={handlePlayerAction}
                  canAfford={canAfford}
                  recommendations={recommendations}
                  showRecommendations={showRecommendations}
                />
              )}
              {selectedColumn === null && (
                <div className="select-column-prompt">
                  ⬆️ Select an action column from your player mat to continue
                </div>
              )}
            </>
          )}
          
          {gameState.currentPlayer === 'ai' && (
            <div className="ai-thinking">
              <div className="thinking-animation">🤖 AI is thinking...</div>
            </div>
          )}

          <GameLog gameLog={gameState.gameLog} />
        </div>
      </div>
    </div>
  );
}

export default App
