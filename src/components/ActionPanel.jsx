import React from 'react';
import './ActionPanel.css';
import { ACTIONS } from '../game/gameState';

export default function ActionPanel({ onAction, canAfford, recommendations, showRecommendations }) {
  const actions = [
    { 
      type: ACTIONS.PRODUCE, 
      label: '🏭 Produce', 
      description: 'Gain 2 Wood, 1 Food',
      cost: '1 Coin'
    },
    { 
      type: ACTIONS.TRADE, 
      label: '🤝 Trade', 
      description: 'Convert resources to coins',
      cost: '2 Wood'
    },
    { 
      type: ACTIONS.BOLSTER, 
      label: '💪 Bolster', 
      description: 'Gain 2 Power, 1 Popularity',
      cost: '1 Coin'
    },
    { 
      type: ACTIONS.BUILD, 
      label: '🏗️ Build', 
      description: 'Construct a building',
      cost: '3 Wood, 2 Coins'
    }
  ];

  return (
    <div className="action-panel">
      <h3>Available Actions</h3>
      <div className="actions-grid">
        {actions.map((action) => {
          const affordable = canAfford(action.type);
          const isRecommended = showRecommendations && recommendations.some(r => r.action.type === action.type);
          
          return (
            <button
              key={action.type}
              className={`action-button ${!affordable ? 'disabled' : ''} ${isRecommended ? 'recommended' : ''}`}
              onClick={() => onAction({ type: action.type, buildingType: 'monument' })}
              disabled={!affordable}
            >
              <div className="action-label">{action.label}</div>
              <div className="action-description">{action.description}</div>
              <div className="action-cost">Cost: {action.cost}</div>
              {isRecommended && <div className="recommended-badge">⭐ Recommended</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
