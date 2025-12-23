import './GameBoard.css';
import { Board, Position, TerritoryType } from '../game/gameState';

type GameBoardProps = {
  board: Board;
  playerPosition: Position;
  aiPosition: Position;
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

  const getTerritoryClass = (q: number, r: number): string => {
    if (q === 0 && r === 0) return 'factory';
    if (playerPosition.x === q && playerPosition.y === r) return 'player-position';
    if (aiPosition.x === q && aiPosition.y === r) return 'ai-position';
    return '';
  };

  // Convert axial coordinates to pixel position for rendering hexagons
  const hexToPixel = (q: number, r: number): { left: number; top: number } => {
    const size = 50; // hex size
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
    const y = size * (3/2 * r);
    return { 
      left: x + 300, // Center offset
      top: y + 250   // Center offset
    };
  };

  return (
    <div className="game-board">
      <h3>Game Board</h3>
      <div className="hexagonal-board">
        {board.territories.map((territory, idx) => {
          const pos = hexToPixel(territory.x, territory.y);
          return (
            <div
              key={idx}
              className={`hex-territory ${getTerritoryClass(territory.x, territory.y)}`}
              style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
              title={`${territory.type} (${territory.x}, ${territory.y})`}
            >
              <div className="hexagon">
                <div className="hex-content">
                  <div className="territory-icon">{getTerritoryIcon(territory.type)}</div>
                  {playerPosition.x === territory.x && playerPosition.y === territory.y && (
                    <div className="unit-marker player-marker">👤</div>
                  )}
                  {aiPosition.x === territory.x && aiPosition.y === territory.y && (
                    <div className="unit-marker ai-marker">🤖</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
