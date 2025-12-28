import "./ActionPanel.css";
import { GameAction, ActionType } from "../game/gameState";
import { ActionRecommendation } from "../game/ai";

type ActionPanelProps = {
  onAction: (action: GameAction) => void;
  canAfford: (actionType: ActionType) => boolean;
  recommendations: ActionRecommendation[];
  showRecommendations: boolean;
};

type ActionInfo = {
  type: ActionType;
  label: string;
  description: string;
  cost: string;
};

export default function ActionPanel({
  onAction,
  canAfford,
  recommendations,
  showRecommendations,
}: ActionPanelProps) {
  const actions: ActionInfo[] = [
    {
      type: ActionType.Produce,
      label: "🏭 Produce",
      description: "Gain 2 Wood, 1 Food",
      cost: "1 Coin",
    },
    {
      type: ActionType.Trade,
      label: "🤝 Trade",
      description: "Convert resources to coins",
      cost: "2 Wood",
    },
    {
      type: ActionType.Bolster,
      label: "💪 Bolster",
      description: "Gain 2 Power, 1 Popularity",
      cost: "1 Coin",
    },
    {
      type: ActionType.Build,
      label: "🏗️ Build",
      description: "Construct a building",
      cost: "3 Wood, 2 Coins",
    },
  ];

  return (
    <div className="action-panel">
      <h3>Available Actions</h3>
      <div className="actions-grid">
        {actions.map((action) => {
          const affordable = canAfford(action.type);
          const isRecommended =
            showRecommendations &&
            recommendations.some((r) => r.action.type === action.type);

          return (
            <button
              key={action.type}
              className={`action-button ${!affordable ? "disabled" : ""} ${isRecommended ? "recommended" : ""}`}
              onClick={() =>
                onAction({ type: action.type, buildingType: "monument" })
              }
              disabled={!affordable}
            >
              <div className="action-label">{action.label}</div>
              <div className="action-description">{action.description}</div>
              <div className="action-cost">Cost: {action.cost}</div>
              {isRecommended && (
                <div className="recommended-badge">⭐ Recommended</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
