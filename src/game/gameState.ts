// Scythe Game State Management

export const FACTIONS = {
  NORDIC: 'Nordic Kingdom',
  CRIMEA: 'Crimean Khanate',
  SAXONY: 'Saxony Empire',
  POLANIA: 'Republic of Polania',
  RUSVIET: 'Rusviet Union'
} as const;

// Faction abilities for water movement
export const FACTION_ABILITIES = {
  NORDIC: { riverwalk: true, lakes: false },      // Can cross rivers
  CRIMEA: { riverwalk: false, lakes: false },     // No water abilities
  SAXONY: { riverwalk: false, lakes: false },     // No water abilities
  POLANIA: { riverwalk: false, lakes: true },     // Can cross lakes
  RUSVIET: { riverwalk: true, lakes: false }      // Can cross rivers
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

// Player mat action columns - each column has top and bottom actions
export type PlayerMatColumn = {
  topAction: ActionType;
  bottomAction: ActionType;
};

export const PLAYER_MAT_CONFIGURATIONS = {
  INDUSTRIAL: [
    { topAction: ACTIONS.MOVE as ActionType, bottomAction: ACTIONS.UPGRADE as ActionType },
    { topAction: ACTIONS.PRODUCE as ActionType, bottomAction: ACTIONS.DEPLOY as ActionType },
    { topAction: ACTIONS.BOLSTER as ActionType, bottomAction: ACTIONS.BUILD as ActionType },
    { topAction: ACTIONS.TRADE as ActionType, bottomAction: ACTIONS.ENLIST as ActionType }
  ],
  ENGINEERING: [
    { topAction: ACTIONS.MOVE as ActionType, bottomAction: ACTIONS.DEPLOY as ActionType },
    { topAction: ACTIONS.TRADE as ActionType, bottomAction: ACTIONS.UPGRADE as ActionType },
    { topAction: ACTIONS.BOLSTER as ActionType, bottomAction: ACTIONS.ENLIST as ActionType },
    { topAction: ACTIONS.PRODUCE as ActionType, bottomAction: ACTIONS.BUILD as ActionType }
  ],
  PATRIOTIC: [
    { topAction: ACTIONS.MOVE as ActionType, bottomAction: ACTIONS.BUILD as ActionType },
    { topAction: ACTIONS.BOLSTER as ActionType, bottomAction: ACTIONS.UPGRADE as ActionType },
    { topAction: ACTIONS.PRODUCE as ActionType, bottomAction: ACTIONS.ENLIST as ActionType },
    { topAction: ACTIONS.TRADE as ActionType, bottomAction: ACTIONS.DEPLOY as ActionType }
  ],
  INNOVATIVE: [
    { topAction: ACTIONS.MOVE as ActionType, bottomAction: ACTIONS.ENLIST as ActionType },
    { topAction: ACTIONS.TRADE as ActionType, bottomAction: ACTIONS.BUILD as ActionType },
    { topAction: ACTIONS.PRODUCE as ActionType, bottomAction: ACTIONS.UPGRADE as ActionType },
    { topAction: ACTIONS.BOLSTER as ActionType, bottomAction: ACTIONS.DEPLOY as ActionType }
  ]
} as const;

export type PlayerMatType = keyof typeof PLAYER_MAT_CONFIGURATIONS;

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

export type FactionAbilities = {
  riverwalk: boolean;
  lakes: boolean;
};

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
  abilities: FactionAbilities;
  playerMat: PlayerMatType;
  lastActionColumn: number | null;  // Track last action column used (cannot repeat)
};

export type Building = {
  type: string;
  position: Position;
};

export type TerritoryType = 'factory' | 'forest' | 'mountain' | 'village' | 'tundra' | 'farm' | 'lake' | 'nordic_home' | 'crimea_home' | 'saxony_home' | 'polania_home' | 'rusviet_home' | 'albion_home' | 'togawa_home' | 'empty';

export type Territory = {
  x: number;
  y: number;
  type: TerritoryType;
  resources: string[];
  controlled: PlayerType | null;
  rivers: RiverEdge[];  // Rivers on the edges of this territory
};

export type RiverEdge = {
  direction: number;  // 0-5 for the 6 hex edges (0=E, 1=NE, 2=NW, 3=W, 4=SW, 5=SE)
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
  // Get faction abilities based on faction
  let abilities: FactionAbilities;
  switch (faction) {
    case FACTIONS.NORDIC:
      abilities = FACTION_ABILITIES.NORDIC;
      break;
    case FACTIONS.CRIMEA:
      abilities = FACTION_ABILITIES.CRIMEA;
      break;
    case FACTIONS.SAXONY:
      abilities = FACTION_ABILITIES.SAXONY;
      break;
    case FACTIONS.POLANIA:
      abilities = FACTION_ABILITIES.POLANIA;
      break;
    case FACTIONS.RUSVIET:
      abilities = FACTION_ABILITIES.RUSVIET;
      break;
    default:
      abilities = { riverwalk: false, lakes: false };
  }

  // Assign player mats - player gets Industrial, AI gets Engineering
  const playerMat: PlayerMatType = type === 'player' ? 'INDUSTRIAL' : 'ENGINEERING';

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
    completedObjectives: [],
    abilities,
    playerMat,
    lastActionColumn: null
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
  // Create a hexagonal board with radius 5 (center at 0,0)
  const radius = 5;
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      territories.push({
        x: q,
        y: r,
        type: getTerritoryType(q, r),
        resources: [],
        controlled: null,
        rivers: getRivers(q, r)
      });
    }
  }
  
  return territories;
}

function getRivers(q: number, r: number): RiverEdge[] {
  const rivers: RiverEdge[] = [];
  const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
  
  // Add rivers on specific edges for rings 1-3
  if (distance >= 1 && distance <= 3) {
    const riverHash = (q * 31 + r * 37) % 17;
    
    // Deterministically add rivers on certain edges
    if (Math.abs(riverHash % 6) < 2) {
      rivers.push({ direction: Math.abs(riverHash % 6) });
    }
    if (Math.abs((riverHash * 2) % 7) < 2) {
      rivers.push({ direction: Math.abs((riverHash * 2) % 6) });
    }
  }
  
  return rivers;
}

function getTerritoryType(q: number, r: number): TerritoryType {
  // Factory at center
  if (q === 0 && r === 0) return 'factory';
  if (q === 0 && r === 1) return 'lake';
  if (q === 0 && r === -1) return 'forest';
  if (q === 0 && r === 2) return 'forest';
  if (q === 0 && r === -2) return 'lake';
  if (q === 0 && r === 3) return 'village';
  if (q === 0 && r === -3) return 'farm';
  if (q === 0 && r === -4) return 'albion_home';

  if (q === 1 && r === 0) return 'mountain';
  if (q === 1 && r === 1) return 'village';
  if (q === 1 && r === -1) return 'lake';
  if (q === 1 && r === 2) return 'mountain';
  if (q === 1 && r === -2) return 'tundra';
  if (q === 1 && r === 3) return 'farm';
  if (q === 1 && r === -3) return 'village';

  if (q === 2 && r === 0) return 'tundra';
  if (q === 2 && r === 1) return 'lake';
  if (q === 2 && r === -1) return 'forest';
  if (q === 2 && r === 2) return 'tundra';
  if (q === 2 && r === -2) return 'mountain';
  if (q === 2 && r === 3) return 'togawa_home';
  if (q === 2 && r === -3) return 'forest';

  if (q === 3 && r === 0) return 'mountain';
  if (q === 3 && r === -1) return 'village';
  if (q === 3 && r === -2) return 'farm';
  if (q === 3 && r === -3) return 'tundra';
  if (q === 3 && r === -4) return 'nordic_home';

  if (q === 4 && r === -1) return 'rusviet_home';
  if (q === 4 && r === -2) return 'farm';
  if (q === 4 && r === 3) return 'empty';
  if (q === 4 && r === -3) return 'village';

    if (q === -1 && r === 0) return 'lake';
    if (q === -1 && r === 1) return 'tundra';
    if (q === -1 && r === -1) return 'mountain';
    if (q === -1 && r === 2) return 'tundra';
    if (q === -1 && r === -2) return 'tundra';
    if (q === -1 && r === 3) return 'mountain';
    if (q === -1 && r === -3) return 'mountain';

    if (q === -2 && r === 0) return 'village';
    if (q === -2 && r === 1) return 'farm';
    if (q === -2 && r === -1) return 'forest';
    if (q === -2 && r === 2) return 'village';
    if (q === -2 && r === -2) return 'lake';
    if (q === -2 && r === 3) return 'farm';
    if (q === -2 && r === 4) return 'village';

    if (q === -3 && r === 0) return 'farm';
    if (q === -3 && r === 1) return 'forest';
    if (q === -3 && r === -1) return 'polania_home';
    if (q === -3 && r === 2) return 'village';
    if (q === -3 && r === 3) return 'lake';
    if (q === -3 && r === 4) return 'crimea_home';

    if (q === -4 && r === 1) return 'forest';
    if (q === -4 && r === 2) return 'mountain';
    if (q === -4 && r === 3) return 'tundra';

    if (q === -5 && r === 3) return 'saxony_home';

  return 'empty';
}

export function applyAction(gameState: GameState, player: PlayerType, action: GameAction, columnIndex?: number): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const playerState = newState[player];
  
  // Apply top row action
  switch (action.type) {
    case ACTIONS.PRODUCE:
      handleProduce(newState, player);
      break;
    case ACTIONS.TRADE:
      handleTrade(newState, player);
      break;
    case ACTIONS.BOLSTER:
      handleBolster(newState, player);
      break;
    case ACTIONS.MOVE:
      handleMove(newState, player, action);
      break;
    case ACTIONS.BUILD:
      handleBuild(newState, player, action);
      break;
  }
  
  // If column index provided, execute bottom row action and track column usage
  if (columnIndex !== undefined) {
    const mat = PLAYER_MAT_CONFIGURATIONS[playerState.playerMat];
    const column = mat[columnIndex];
    
    // Execute bottom row action if it matches the action type
    if (column && column.topAction === action.type) {
      executeBottomAction(newState, player, column.bottomAction);
      
      // Track last action column (can't use same column on next turn)
      playerState.lastActionColumn = columnIndex;
    }
  }
  
  return newState;
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

/**
 * Get available action columns for a player
 */
export function getAvailableActionColumns(playerState: PlayerState): number[] {
  const mat = PLAYER_MAT_CONFIGURATIONS[playerState.playerMat];
  const availableColumns: number[] = [];
  
  // Can use any column except the one used last turn
  for (let i = 0; i < mat.length; i++) {
    if (playerState.lastActionColumn !== i) {
      availableColumns.push(i);
    }
  }
  
  return availableColumns;
}

/**
 * Execute bottom row action based on type
 */
function executeBottomAction(gameState: GameState, player: PlayerType, actionType: ActionType): void {
  const playerState = gameState[player];
  
  switch (actionType) {
    case ACTIONS.UPGRADE:
      // Upgrade: Gain 1 coin reduction on future actions
      playerState.resources[RESOURCES.COIN] += 1;
      gameState.gameLog.push({
        turn: gameState.currentTurn,
        player,
        action: 'Upgraded',
        details: 'Infrastructure improved'
      });
      break;
      
    case ACTIONS.DEPLOY:
      // Deploy: Add a mech
      if (playerState.resources[RESOURCES.METAL] >= 4) {
        playerState.resources[RESOURCES.METAL] -= 4;
        playerState.units.mechs += 1;
        gameState.gameLog.push({
          turn: gameState.currentTurn,
          player,
          action: 'Deployed',
          details: 'Mech deployed'
        });
      }
      break;
      
    case ACTIONS.BUILD:
      // Build: Construct building
      if (playerState.resources[RESOURCES.WOOD] >= 3 && playerState.resources[RESOURCES.COIN] >= 2) {
        playerState.resources[RESOURCES.WOOD] -= 3;
        playerState.resources[RESOURCES.COIN] -= 2;
        playerState.buildings.push({
          type: 'structure',
          position: playerState.position
        });
        gameState.gameLog.push({
          turn: gameState.currentTurn,
          player,
          action: 'Built',
          details: 'Structure erected'
        });
      }
      break;
      
    case ACTIONS.ENLIST:
      // Enlist: Add recruit (gain bonus)
      if (playerState.resources[RESOURCES.FOOD] >= 3) {
        playerState.resources[RESOURCES.FOOD] -= 3;
        playerState.resources[RESOURCES.POPULARITY] += 2;
        gameState.gameLog.push({
          turn: gameState.currentTurn,
          player,
          action: 'Enlisted',
          details: 'Recruit joined'
        });
      }
      break;
  }
}

/**
 * Check if a player can move to a destination territory
 */
export function canMoveTo(
  gameState: GameState,
  player: PlayerType,
  sourcePos: Position,
  destination: Position
): boolean {
  const playerState = gameState[player];
  const destTerritory = gameState.board.territories.find(
    t => t.x === destination.x && t.y === destination.y
  );
  
  if (!destTerritory) return false;
  
  // Check if destination is a lake
  if (destTerritory.type === 'lake') {
    // Need lake ability to move to lakes
    return playerState.abilities.lakes;
  }
  
  // Check if there's a river between source and destination
  const sourceTerritory = gameState.board.territories.find(
    t => t.x === sourcePos.x && t.y === sourcePos.y
  );
  
  if (sourceTerritory && hasRiverBetween(sourceTerritory, destination)) {
    // Need riverwalk ability to cross rivers
    return playerState.abilities.riverwalk;
  }
  
  // All other terrain types are accessible
  return true;
}

/**
 * Check if there's a river between two adjacent hexes
 */
function hasRiverBetween(territory: Territory, destination: Position): boolean {
  // Calculate direction from territory to destination
  const dx = destination.x - territory.x;
  const dy = destination.y - territory.y;
  
  // Map direction to edge number (0-5)
  let direction = -1;
  if (dx === 1 && dy === 0) direction = 0;      // East
  else if (dx === 1 && dy === -1) direction = 1; // Northeast
  else if (dx === 0 && dy === -1) direction = 2; // Northwest
  else if (dx === -1 && dy === 0) direction = 3; // West
  else if (dx === -1 && dy === 1) direction = 4; // Southwest
  else if (dx === 0 && dy === 1) direction = 5;  // Southeast
  
  // Check if this edge has a river
  return territory.rivers.some(river => river.direction === direction);
}
