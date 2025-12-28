import "./GameLog.css";
import { GameLogEntry } from "../game/gameState";

type GameLogProps = {
  gameLog: GameLogEntry[];
};

export default function GameLog({ gameLog }: GameLogProps) {
  return (
    <div className="game-log">
      <h3>Game Log</h3>
      <div className="log-entries">
        {gameLog.length === 0 ? (
          <div className="log-empty">No actions yet. Start playing!</div>
        ) : (
          gameLog
            .slice()
            .reverse()
            .map((entry, idx) => (
              <div key={idx} className={`log-entry ${entry.player}`}>
                <div className="log-turn">Turn {entry.turn}</div>
                <div className="log-player">
                  {entry.player === "player" ? "👤 Player" : "🤖 AI"}
                </div>
                <div className="log-action">{entry.action}</div>
                {entry.details && (
                  <div className="log-details">{entry.details}</div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
