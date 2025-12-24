import "./PlayerMat.css";
import {
  PlayerState,
  PLAYER_MAT_CONFIGURATIONS,
  ACTIONS,
  ActionType,
} from "../game/gameState";

type PlayerMatProps = {
  playerState: PlayerState;
  onSelectColumn: (columnIndex: number) => void;
  availableColumns: number[];
};

export default function PlayerMat({
  playerState,
  onSelectColumn,
  availableColumns,
}: PlayerMatProps) {
  const mat = PLAYER_MAT_CONFIGURATIONS[playerState.playerMat];

  const getActionLabel = (actionType: ActionType): string => {
    switch (actionType) {
      case ACTIONS.MOVE:
        return "🚶 Move";
      case ACTIONS.PRODUCE:
        return "🏭 Produce";
      case ACTIONS.TRADE:
        return "🤝 Trade";
      case ACTIONS.BOLSTER:
        return "💪 Bolster";
      case ACTIONS.BUILD:
        return "🏗️ Build";
      case ACTIONS.UPGRADE:
        return "⬆️ Upgrade";
      case ACTIONS.DEPLOY:
        return "🤖 Deploy";
      case ACTIONS.ENLIST:
        return "🎖️ Enlist";
      default:
        return actionType;
    }
  };

  const getActionDescription = (actionType: ActionType): string => {
    switch (actionType) {
      case ACTIONS.MOVE:
        return "Move units";
      case ACTIONS.PRODUCE:
        return "Gain resources";
      case ACTIONS.TRADE:
        return "Trade for coins";
      case ACTIONS.BOLSTER:
        return "Gain power";
      case ACTIONS.BUILD:
        return "Build structure";
      case ACTIONS.UPGRADE:
        return "Improve mat";
      case ACTIONS.DEPLOY:
        return "Deploy mech";
      case ACTIONS.ENLIST:
        return "Recruit joins";
      default:
        return "";
    }
  };

  return (
    <div className="player-mat">
      <h3>Player Mat: {mat.name.charAt(0).toUpperCase() + mat.name.slice(1)} (#{mat.number})</h3>
      <p className="mat-info">
        Choose an action column (cannot repeat last column)
      </p>
      <div className="mat-columns">
        {mat.actions.map((column, index) => {
          const isAvailable = availableColumns.includes(index);
          const isLast = playerState.lastActionColumn === index;

          return (
            <div
              key={index}
              className={`mat-column ${!isAvailable ? "disabled" : ""} ${isLast ? "last-used" : ""}`}
              onClick={() => isAvailable && onSelectColumn(index)}
            >
              <div className="top-action">
                <div className="action-label">
                  {getActionLabel(column.topAction.type)}
                </div>
                <div className="action-desc">
                  {getActionDescription(column.topAction.type)}
                </div>
              </div>
              <div className="action-divider">+</div>
              <div className="bottom-action">
                <div className="action-label">
                  {getActionLabel(column.bottomAction.type)}
                </div>
                <div className="action-desc">
                  {getActionDescription(column.bottomAction.type)}
                </div>
              </div>
              {isLast && <div className="last-used-badge">Last Turn</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
