// Scythe AI Decision Making

import { ACTIONS, RESOURCES, applyAction, calculateScore, GameState, PlayerState, GameAction, Position, PlayerType } from './gameState';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ActionRecommendation = {
  action: GameAction;
  score: number;
  description: string;
};

export class ScytheAI {
  difficulty: Difficulty;
  lookaheadDepth: number;

  constructor(difficulty: Difficulty = 'medium') {
    this.difficulty = difficulty;
    this.lookaheadDepth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  }

  /**
   * Choose the best action for the AI
   */
  chooseAction(gameState: GameState): GameAction {
    const aiState = gameState.ai;
    const possibleActions = this.generatePossibleActions(gameState, aiState);
    
    if (possibleActions.length === 0) {
      // Default to produce if no actions available
      return { type: ACTIONS.PRODUCE };
    }

    // Evaluate each action
    const evaluatedActions = possibleActions.map(action => ({
      action,
      score: this.evaluateAction(gameState, 'ai', action)
    }));

    // Sort by score and pick the best
    evaluatedActions.sort((a, b) => b.score - a.score);

    // Add some randomness for easier difficulties
    if (this.difficulty === 'easy' && Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * Math.min(3, evaluatedActions.length));
      return evaluatedActions[randomIndex]!.action;
    }

    return evaluatedActions[0]!.action;
  }

  /**
   * Generate all possible actions for the AI
   */
  generatePossibleActions(_gameState: GameState, playerState: PlayerState): GameAction[] {
    const actions: GameAction[] = [];

    // Produce action
    if (playerState.resources[RESOURCES.COIN] >= 1) {
      actions.push({ type: ACTIONS.PRODUCE });
    }

    // Trade action
    if (playerState.resources[RESOURCES.WOOD] >= 2) {
      actions.push({ type: ACTIONS.TRADE });
    }

    // Bolster action
    if (playerState.resources[RESOURCES.COIN] >= 1) {
      actions.push({ type: ACTIONS.BOLSTER });
    }

    // Build action
    if (playerState.resources[RESOURCES.WOOD] >= 3 && playerState.resources[RESOURCES.COIN] >= 2) {
      actions.push({ type: ACTIONS.BUILD, buildingType: 'monument' });
    }

    // Move actions (simplified)
    const adjacentPositions = this.getAdjacentPositions(playerState.position);
    adjacentPositions.forEach(pos => {
      actions.push({ type: ACTIONS.MOVE, destination: pos });
    });

    return actions;
  }

  /**
   * Evaluate an action's value
   */
  evaluateAction(gameState: GameState, player: PlayerType, action: GameAction): number {
    // Simulate the action
    const simulatedState = applyAction(gameState, player, action);
    const playerState = simulatedState[player];

    let score = 0;

    // Evaluate based on resources gained/lost
    score += this.evaluateResources(playerState);

    // Evaluate strategic position
    score += this.evaluateStrategicValue(simulatedState, player, action);

    // Evaluate economy
    score += this.evaluateEconomy(playerState);

    return score;
  }

  /**
   * Evaluate resource values
   */
  evaluateResources(playerState: PlayerState): number {
    let score = 0;
    
    // Value different resources
    score += playerState.resources[RESOURCES.COIN] * 1.5;
    score += playerState.resources[RESOURCES.WOOD] * 1.0;
    score += playerState.resources[RESOURCES.FOOD] * 1.0;
    score += playerState.resources[RESOURCES.METAL] * 1.2;
    score += playerState.resources[RESOURCES.OIL] * 1.3;
    score += playerState.resources[RESOURCES.POWER] * 2.0;
    score += playerState.resources[RESOURCES.POPULARITY] * 3.0;

    return score;
  }

  /**
   * Evaluate strategic value of an action
   */
  evaluateStrategicValue(gameState: GameState, player: PlayerType, action: GameAction): number {
    let score = 0;
    const playerState = gameState[player];

    switch (action.type) {
      case ACTIONS.PRODUCE: {
        // Production is valuable early game
        score += 5;
        break;
      }
      
      case ACTIONS.BOLSTER: {
        // Bolstering is valuable for power and popularity
        score += 8;
        break;
      }
      
      case ACTIONS.BUILD: {
        // Building is valuable for points
        score += 10;
        break;
      }
      
      case ACTIONS.TRADE: {
        // Trading is good when resources are abundant
        if (playerState.resources[RESOURCES.WOOD] > 5) {
          score += 7;
        } else {
          score += 3;
        }
        break;
      }
      
      case ACTIONS.MOVE: {
        // Movement towards factory or unexplored territories
        if (action.destination) {
          const factory = gameState.board.factory;
          const distanceToFactory = Math.abs(action.destination.x - factory.x) + 
                                   Math.abs(action.destination.y - factory.y);
          score += Math.max(0, 10 - distanceToFactory);
        }
        break;
      }
    }

    return score;
  }

  /**
   * Evaluate overall economy
   */
  evaluateEconomy(playerState: PlayerState): number {
    let score = 0;

    // Balanced resources are good
    const resourceCount = Object.values(playerState.resources).reduce((sum, val) => sum + val, 0);
    score += resourceCount * 0.5;

    // Buildings provide ongoing value
    score += playerState.buildings.length * 5;

    // Stars are victory conditions
    score += playerState.stars * 20;

    return score;
  }

  /**
   * Get adjacent positions on the board
   */
  getAdjacentPositions(position: Position): Position[] {
    const positions: Position[] = [];
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ];

    directions.forEach(dir => {
      const newPos: Position = {
        x: Math.max(0, Math.min(8, position.x + dir.x)),
        y: Math.max(0, Math.min(8, position.y + dir.y))
      };
      positions.push(newPos);
    });

    return positions;
  }

  /**
   * Calculate the best action using lookahead
   */
  calculateBestAction(gameState: GameState, depth: number = 0): GameAction | null {
    if (depth >= this.lookaheadDepth) {
      return null;
    }

    const possibleActions = this.generatePossibleActions(gameState, gameState.ai);
    
    let bestAction: GameAction | null = null;
    let bestScore = -Infinity;

    possibleActions.forEach(action => {
      const simulatedState = applyAction(gameState, 'ai', action);
      const score = calculateScore(simulatedState.ai);
      
      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }
    });

    return bestAction;
  }
}

/**
 * Get action recommendations for the player
 */
export function getActionRecommendations(gameState: GameState): ActionRecommendation[] {
  const ai = new ScytheAI('hard');
  const possibleActions = ai.generatePossibleActions(gameState, gameState.player);
  
  const evaluatedActions: ActionRecommendation[] = possibleActions.map(action => ({
    action,
    score: ai.evaluateAction(gameState, 'player', action),
    description: getActionDescription(action)
  }));

  evaluatedActions.sort((a, b) => b.score - a.score);
  
  return evaluatedActions.slice(0, 5);
}

function getActionDescription(action: GameAction): string {
  switch (action.type) {
    case ACTIONS.PRODUCE:
      return 'Produce resources (Wood, Food) - Cost: 1 Coin';
    case ACTIONS.TRADE:
      return 'Trade resources for coins - Cost: 2 Wood';
    case ACTIONS.BOLSTER:
      return 'Gain Power and Popularity - Cost: 1 Coin';
    case ACTIONS.BUILD:
      return `Build ${action.buildingType ?? 'structure'} - Cost: 3 Wood, 2 Coins`;
    case ACTIONS.MOVE:
      return action.destination 
        ? `Move to (${action.destination.x}, ${action.destination.y})`
        : 'Move';
    default:
      return 'Unknown action';
  }
}
