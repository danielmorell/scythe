import './GameBoard.css';
import { Board, Position, TerritoryType } from '../game/gameState';

type GameBoardProps = {
  board: Board;
  playerPosition: Position;
  aiPosition: Position;
};

type DisplayTerritory = {
  x: number;
  y: number;
  type: TerritoryType;
};

export default function GameBoard({ board, playerPosition, aiPosition }: GameBoardProps) {
  const getTerritoryIcon = (type: TerritoryType): string => {
    switch (type) {
      case 'factory': return '🏭';
      case 'forest': return '🌲';
      case 'mountain': return '⛰️';
      case 'village': return '🏘️';
      case 'tundra': return '❄️';
      case 'farm': return '🌾';
      default: return '📍';
    }
  };

  const getTerritoryClass = (x: number, y: number): string => {
    if (x === 4 && y === 4) return 'factory';
    if (playerPosition.x === x && playerPosition.y === y) return 'player-position';
    if (aiPosition.x === x && aiPosition.y === y) return 'ai-position';
    return '';
  };

  // Create a simplified 9x9 grid view
  const gridSize = 9;
  const territories: DisplayTerritory[] = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const territory = board.territories.find(t => t.x === x && t.y === y);
      territories.push(territory || { x, y, type: 'tundra' as TerritoryType });
    }
  }

  return (
    <div className="game-board">
      <h3>Game Board</h3>
      <div className="board-grid">
        {territories.map((territory, idx) => (
          <div
            key={idx}
            className={`territory ${getTerritoryClass(territory.x, territory.y)}`}
            title={`${territory.type} (${territory.x}, ${territory.y})`}
          >
            <div className="territory-icon">{getTerritoryIcon(territory.type)}</div>
            {playerPosition.x === territory.x && playerPosition.y === territory.y && (
              <div className="unit-marker player-marker">👤</div>
            )}
            {aiPosition.x === territory.x && aiPosition.y === territory.y && (
              <div className="unit-marker ai-marker">🤖</div>
            )}
          </div>
        ))}
      </div>
      <div className="board-legend">
        <div className="legend-item">
          <span className="legend-icon">👤</span>
          <span>Your Position</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🤖</span>
          <span>AI Position</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🏭</span>
          <span>Factory (Center)</span>
        </div>
      </div>
    </div>
  );
}
