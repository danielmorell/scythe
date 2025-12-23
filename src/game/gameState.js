// Scythe Game State Management

export const FACTIONS = {
  NORDIC: 'Nordic Kingdom',
  CRIMEA: 'Crimean Khanate',
  SAXONY: 'Saxony Empire',
  POLANIA: 'Republic of Polania',
  RUSVIET: 'Rusviet Union'
};

export const RESOURCES = {
  COIN: 'coin',
  POWER: 'power',
  POPULARITY: 'popularity',
  WOOD: 'wood',
  FOOD: 'food',
  METAL: 'metal',
  OIL: 'oil'
};

export const ACTIONS = {
  MOVE: 'move',
  PRODUCE: 'produce',
  TRADE: 'trade',
  BOLSTER: 'bolster',
  BUILD: 'build',
  ENLIST: 'enlist',
  UPGRADE: 'upgrade',
  DEPLOY: 'deploy'
};

export function createInitialGameState(playerFaction, aiFaction) {
  return {
    currentTurn: 0,
    currentPlayer: 'player',
    player: createPlayerState(playerFaction, 'player'),
    ai: createPlayerState(aiFaction, 'ai'),
    board: createBoard(),
    gameLog: []
  };
}

function createPlayerState(faction, type) {
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

function createBoard() {
  // Simplified board representation
  return {
    territories: generateTerritories(),
    factory: { x: 4, y: 4 }
  };
}

function generateTerritories() {
  const territories = [];
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      territories.push({
        x,
        y,
        type: getTerritoryType(x, y),
        resources: [],
        controlled: null
      });
    }
  }
  return territories;
}

function getTerritoryType(x, y) {
  // Factory at center
  if (x === 4 && y === 4) return 'factory';
  
  // Random terrain types
  const rand = (x * 7 + y * 11) % 5;
  const types = ['forest', 'mountain', 'village', 'tundra', 'farm'];
  return types[rand];
}

export function applyAction(gameState, player, action) {
  const newState = JSON.parse(JSON.stringify(gameState));
  
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

function handleProduce(gameState, player) {
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

function handleTrade(gameState, player) {
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

function handleBolster(gameState, player) {
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

function handleMove(gameState, player, action) {
  const playerState = gameState[player];
  
  // Simple movement
  playerState.position = action.destination;
  
  gameState.gameLog.push({
    turn: gameState.currentTurn,
    player,
    action: 'Moved',
    details: `to (${action.destination.x}, ${action.destination.y})`
  });
  
  return gameState;
}

function handleBuild(gameState, player, action) {
  const playerState = gameState[player];
  
  // Build structure
  if (playerState.resources[RESOURCES.WOOD] >= 3 && playerState.resources[RESOURCES.COIN] >= 2) {
    playerState.resources[RESOURCES.WOOD] -= 3;
    playerState.resources[RESOURCES.COIN] -= 2;
    playerState.buildings.push({ type: action.buildingType, position: playerState.position });
    
    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: 'Built',
      details: action.buildingType
    });
  }
  
  return gameState;
}

export function switchTurn(gameState) {
  const newState = { ...gameState };
  newState.currentPlayer = newState.currentPlayer === 'player' ? 'ai' : 'player';
  if (newState.currentPlayer === 'player') {
    newState.currentTurn += 1;
  }
  return newState;
}

export function calculateScore(playerState) {
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
