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
      case 'lake': return '🌊';
      default: return '⛺';
    }
  };

  const getTerritoryColor = (type: TerritoryType): string => {
    switch (type) {
      case 'factory': return '#A9A9A9';
      case 'forest': return '#60524e';
      case 'mountain': return '#a6a6a6';
      case 'village': return '#a36c6c';
      case 'tundra': return '#697e9c';
      case 'farm': return '#aaa175';
      case 'lake': return '#1E90FF';
        case "albion_home": return '#284925';
        case "crimea_home": return '#bca50e';
        case 'nordic_home': return '#13458f';
        case "polania_home": return '#efefef';
        case "rusviet_home": return '#ba1c1c';
        case "saxony_home": return '#191918';
        case "togawa_home": return '#48317e';
        default: return '#D3D3D3';
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
      left: x + 500, // Center offset
      top: y + 350   // Center offset
    };
  };

  return (
    <div className="game-board">
      <h3>Game Board</h3>
      <div className="hexagonal-board">
        {board.territories.map((territory, idx) => {
            if (territory.type === 'empty') return null;
          const pos = hexToPixel(territory.x, territory.y);
          return (
            <div
              key={idx}
              className={`hex-territory ${getTerritoryClass(territory.x, territory.y)}`}
              style={{ left: `${pos.left}px`, top: `${pos.top}px`}}
              title={`${territory.type} (${territory.x}, ${territory.y})`}
            >
              <div className="hexagon" style={{backgroundColor: getTerritoryColor(territory.type)}}>
                <div className="hex-content">
                  <div className="territory-icon">{getTerritoryIcon(territory.type)}</div>
                  {/*<div>({territory.x}, {territory.y})</div>*/}
                  {playerPosition.x === territory.x && playerPosition.y === territory.y && (
                    <div className="unit-marker player-marker">👤</div>
                  )}
                  {aiPosition.x === territory.x && aiPosition.y === territory.y && (
                    <div className="unit-marker ai-marker">🤖</div>
                  )}
                </div>
                {/* Render rivers on edges */}
                {territory.rivers.map((river, riverIdx) => (
                  <div
                    key={riverIdx}
                    className={`river-edge river-direction-${river.direction}`}
                  />
                ))}
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
