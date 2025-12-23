// Scythe Game State Management

export const FACTIONS = {
  NORDIC: 'Nordic Kingdom',
  CRIMEA: 'Crimean Khanate',
  SAXONY: 'Saxony Empire',
  POLANIA: 'Republic of Polania',
  RUSVIET: 'Rusviet Union'
} as const;

export const RESOURCES = {
  COIN: 'coin',
  POWER: 'power',
  POPULARITY: 'popularity',
  WOOD: 'wood',
  FOOD: 'food',
  METAL: 'metal',
  OIL: 'oil'
} as const;

export const ACTIONS = {
  MOVE: 'move',
  PRODUCE: 'produce',
  TRADE: 'trade',
  BOLSTER: 'bolster',
  BUILD: 'build',
  ENLIST: 'enlist',
  UPGRADE: 'upgrade',
  DEPLOY: 'deploy'
} as const;

export type Faction = typeof FACTIONS[keyof typeof FACTIONS];
export type ResourceType = typeof RESOURCES[keyof typeof RESOURCES];
export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];

export type Position = {
  x: number;
  y: number;
};

export type ResourceMap = {
  [K in ResourceType]: number;
};

export type PlayerType = 'player' | 'ai';

export type PlayerState = {
  faction: Faction;
  type: PlayerType;
  resources: ResourceMap;
  stars: number;
  units: {
    workers: number;
    mechs: number;
    character: number;
  };
  position: Position;
  buildings: Building[];
  completedObjectives: string[];
};

export type Building = {
  type: string;
  position: Position;
};

export type TerritoryType = 'factory' | 'forest' | 'mountain' | 'village' | 'tundra' | 'farm';

export type Territory = {
  x: number;
  y: number;
  type: TerritoryType;
  resources: string[];
  controlled: PlayerType | null;
};

export type Board = {
  territories: Territory[];
  factory: Position;
};

export type GameLogEntry = {
  turn: number;
  player: PlayerType;
  action: string;
  details?: string;
};

export type GameState = {
  currentTurn: number;
  currentPlayer: PlayerType;
  player: PlayerState;
  ai: PlayerState;
  board: Board;
  gameLog: GameLogEntry[];
};

export type GameAction = {
  type: ActionType;
  destination?: Position;
  buildingType?: string;
};

export function createInitialGameState(playerFaction: Faction, aiFaction: Faction): GameState {
  return {
    currentTurn: 0,
    currentPlayer: 'player',
    player: createPlayerState(playerFaction, 'player'),
    ai: createPlayerState(aiFaction, 'ai'),
    board: createBoard(),
    gameLog: []
  };
}

function createPlayerState(faction: Faction, type: PlayerType): PlayerState {
  return {
    faction,
    type,
    resources: {
      [RESOURCES.COIN]: 10,
      [RESOURCES.POWER]: 0,
      [RESOURCES.POPULARITY]: 0,
      [RESOURCES.WOOD]: 2,
      [RESOURCES.FOOD]: 2,
      [RESOURCES.METAL]: 2,
      [RESOURCES.OIL]: 0
    },
    stars: 0,
    units: {
      workers: 2,
      mechs: 0,
      character: 1
    },
    position: { x: 0, y: 0 },
    buildings: [],
    completedObjectives: []
  };
}

function createBoard(): Board {
  // Hexagonal board representation
  return {
    territories: generateTerritories(),
    factory: { x: 0, y: 0 }  // Center of hexagonal grid
  };
}

function generateTerritories(): Territory[] {
  const territories: Territory[] = [];
  // Generate hexagonal grid using axial coordinates
  // Create a hexagonal board with radius 4 (center at 0,0)
  const radius = 4;
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      territories.push({
        x: q,
        y: r,
        type: getTerritoryType(q, r),
        resources: [],
        controlled: null
      });
    }
  }
  
  return territories;
}

function getTerritoryType(q: number, r: number): TerritoryType {
  // Factory at center
  if (q === 0 && r === 0) return 'factory';
  
  // Random terrain types based on axial coordinates
  const hash = (q * 7 + r * 11) % 5;
  const absHash = Math.abs(hash);
  const types: TerritoryType[] = ['forest', 'mountain', 'village', 'tundra', 'farm'];
  return types[absHash]!;
}

export function applyAction(gameState: GameState, player: PlayerType, action: GameAction): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  switch (action.type) {
    case ACTIONS.PRODUCE:
      return handleProduce(newState, player);
    case ACTIONS.TRADE:
      return handleTrade(newState, player);
    case ACTIONS.BOLSTER:
      return handleBolster(newState, player);
    case ACTIONS.MOVE:
      return handleMove(newState, player, action);
    case ACTIONS.BUILD:
      return handleBuild(newState, player, action);
    default:
      return newState;
  }
}

function handleProduce(gameState: GameState, player: PlayerType): GameState {
  const playerState = gameState[player];
  
  // Simple produce action - gain resources
  if (playerState.resources[RESOURCES.COIN] >= 1) {
    playerState.resources[RESOURCES.COIN] -= 1;
    playerState.resources[RESOURCES.WOOD] += 2;
    playerState.resources[RESOURCES.FOOD] += 1;
    
    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: 'Produced resources',
      details: '+2 Wood, +1 Food'
    });
  }
  
  return gameState;
}

function handleTrade(gameState: GameState, player: PlayerType): GameState {
  const playerState = gameState[player];
  
  // Simple trade - convert resources to coins
  if (playerState.resources[RESOURCES.WOOD] >= 2) {
    playerState.resources[RESOURCES.WOOD] -= 2;
    playerState.resources[RESOURCES.COIN] += 3;
    
    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: 'Traded',
      details: '-2 Wood, +3 Coins'
    });
  }
  
  return gameState;
}

function handleBolster(gameState: GameState, player: PlayerType): GameState {
  const playerState = gameState[player];
  
  // Gain power
  if (playerState.resources[RESOURCES.COIN] >= 1) {
    playerState.resources[RESOURCES.COIN] -= 1;
    playerState.resources[RESOURCES.POWER] += 2;
    playerState.resources[RESOURCES.POPULARITY] += 1;
    
    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: 'Bolstered',
      details: '+2 Power, +1 Popularity'
    });
  }
  
  return gameState;
}

function handleMove(gameState: GameState, player: PlayerType, action: GameAction): GameState {
  const playerState = gameState[player];
  
  // Simple movement
  if (action.destination) {
    playerState.position = action.destination;
    
    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: 'Moved',
      details: `to (${action.destination.x}, ${action.destination.y})`
    });
  }
  
  return gameState;
}

function handleBuild(gameState: GameState, player: PlayerType, action: GameAction): GameState {
  const playerState = gameState[player];
  
  // Build structure
  if (playerState.resources[RESOURCES.WOOD] >= 3 && playerState.resources[RESOURCES.COIN] >= 2) {
    playerState.resources[RESOURCES.WOOD] -= 3;
    playerState.resources[RESOURCES.COIN] -= 2;
    
    if (action.buildingType) {
      playerState.buildings.push({ type: action.buildingType, position: playerState.position });
      
      gameState.gameLog.push({
        turn: gameState.currentTurn,
        player,
        action: 'Built',
        details: action.buildingType
      });
    }
  }
  
  return gameState;
}

export function switchTurn(gameState: GameState): GameState {
  const newState = { ...gameState };
  newState.currentPlayer = newState.currentPlayer === 'player' ? 'ai' : 'player';
  if (newState.currentPlayer === 'player') {
    newState.currentTurn += 1;
  }
  return newState;
}

export function calculateScore(playerState: PlayerState): number {
  let score = 0;
  
  // Coins
  score += playerState.resources[RESOURCES.COIN];
  
  // Stars (major achievements)
  score += playerState.stars * 5;
  
  // Popularity bonus
  score += playerState.resources[RESOURCES.POPULARITY] * 2;
  
  // Buildings
  score += playerState.buildings.length * 3;
  
  return score;
}
