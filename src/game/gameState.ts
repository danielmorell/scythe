// Scythe Game State Management

export const FACTIONS = {
  NORDIC: "Nordic Kingdom",
  CRIMEA: "Crimean Khanate",
  SAXONY: "Saxony Empire",
  POLANIA: "Republic of Polania",
  RUSVIET: "Rusviet Union",
} as const;

export enum FactionTypes {
  Albian = "albion",
  Crimea = "crimea",
  Nordic = "nordic",
  Polania = "polania",
  Rusviet = "rusviet",
  Saxony = "saxony",
  Togawa = "togawa",
}

// Faction abilities for water movement
export const FACTION_ABILITIES = {
  NORDIC: { riverwalk: true, lakes: false }, // Can cross rivers
  CRIMEA: { riverwalk: false, lakes: false }, // No water abilities
  SAXONY: { riverwalk: false, lakes: false }, // No water abilities
  POLANIA: { riverwalk: false, lakes: true }, // Can cross lakes
  RUSVIET: { riverwalk: true, lakes: false }, // Can cross rivers
} as const;

export const RESOURCES = {
  COIN: "coin",
  POWER: "power",
  POPULARITY: "popularity",
  WOOD: "wood",
  FOOD: "food",
  METAL: "metal",
  OIL: "oil",
  COMBAT_CARD: "combat_card",
} as const;

export enum ResourceType {
  Coin = "coin",
  Power = "power",
  Popularity = "popularity",
  Wood = "wood",
  Food = "food",
  Metal = "metal",
  Oil = "oil",
  CombatCard = "combat_card",
}

export const ACTIONS = {
  MOVE: "move",
  PRODUCE: "produce",
  TRADE: "trade",
  BOLSTER: "bolster",
  BUILD: "build",
  ENLIST: "enlist",
  UPGRADE: "upgrade",
  DEPLOY: "deploy",
} as const;

export enum ActionType {
  Move = "move",
  Produce = "produce",
  Trade = "trade",
  Bolster = "bolster",
  Build = "build",
  Enlist = "enlist",
  Upgrade = "upgrade",
  Deploy = "deploy",
}

// Player mat action columns - each column has top and bottom actions
export type PlayerMatColumn = {
  topAction: Action;
  bottomAction: Action;
};

export type Action = {
  type: ActionType;
  cost: Cost[];
  benefitA: Benefit[];
  benefitB?: Benefit[];
};

export type Cost = {
  type: ResourceType;
  upgradeable?: boolean;
  workersEnlisted?: number;
};

export enum BenefitType {
  Coin = "coin",
  Power = "power",
  Popularity = "popularity",
  CombatCard = "combat_card",
  WorkerResource = "worker_resource",
  Resource = "resource",
  Upgrade = "upgrade",
  Enlistment = "enlistment",
  Structure = "structure",
  Mech = "mech",
  Movement1Hex = "movement_1_hex",
  Movement2Hex = "movement_2_hex",
}

export enum BenefitRequirement {
  None = "none",
  Upgrade = "upgrade",
  Enlistment = "enlistment",
  Monument = "monument",
  Mill = "mill",
  Armory = "armory",
}

export type Benefit = {
  // Either resource types or the number of movement hexes a player can move a unit.
  type: BenefitType;
  requirements: BenefitRequirement;
  onWorkerHex?: boolean;
};

export type PlayerMat = {
  name: string;
  number: string;
  startingResources: ResourceType[];
  actions: PlayerMatColumn[];
};

export const COMMON_PRODUCE: Action = {
  type: ActionType.Produce,
  cost: [
    { type: ResourceType.Power, workersEnlisted: 2 },
    { type: ResourceType.Popularity, workersEnlisted: 4 },
    { type: ResourceType.Coin, workersEnlisted: 6 },
  ],
  benefitA: [
    {
      type: BenefitType.WorkerResource,
      requirements: BenefitRequirement.None,
      onWorkerHex: true,
    },
    {
      type: BenefitType.WorkerResource,
      requirements: BenefitRequirement.None,
      onWorkerHex: true,
    },
    {
      type: BenefitType.WorkerResource,
      requirements: BenefitRequirement.Upgrade,
      onWorkerHex: true,
    },
    { type: BenefitType.WorkerResource, requirements: BenefitRequirement.Mill },
  ],
};

export const COMMON_TRADE: Action = {
  type: ActionType.Trade,
  cost: [{ type: ResourceType.Coin }],
  benefitA: [
    { type: BenefitType.Resource, requirements: BenefitRequirement.None },
    { type: BenefitType.Resource, requirements: BenefitRequirement.None },
    { type: BenefitType.Power, requirements: BenefitRequirement.Armory },
  ],
  benefitB: [
    { type: BenefitType.Popularity, requirements: BenefitRequirement.None },
    { type: BenefitType.Popularity, requirements: BenefitRequirement.Upgrade },
    { type: BenefitType.Power, requirements: BenefitRequirement.Armory },
  ],
};

export const COMMON_BOLSTER: Action = {
  type: ActionType.Bolster,
  cost: [{ type: ResourceType.Coin }],
  benefitA: [
    { type: BenefitType.Power, requirements: BenefitRequirement.None },
    { type: BenefitType.Power, requirements: BenefitRequirement.None },
    { type: BenefitType.Power, requirements: BenefitRequirement.Upgrade },
    { type: BenefitType.Popularity, requirements: BenefitRequirement.Monument },
  ],
  benefitB: [
    { type: BenefitType.CombatCard, requirements: BenefitRequirement.None },
    { type: BenefitType.CombatCard, requirements: BenefitRequirement.Upgrade },
    { type: BenefitType.Popularity, requirements: BenefitRequirement.Monument },
  ],
};

export const COMMON_MOVE: Action = {
  type: ActionType.Move,
  cost: [],
  benefitA: [
    { type: BenefitType.Movement1Hex, requirements: BenefitRequirement.None },
    { type: BenefitType.Movement1Hex, requirements: BenefitRequirement.None },
    {
      type: BenefitType.Movement1Hex,
      requirements: BenefitRequirement.Upgrade,
    },
  ],
  benefitB: [
    { type: BenefitType.Coin, requirements: BenefitRequirement.None },
    { type: BenefitType.Coin, requirements: BenefitRequirement.None },
  ],
};

export const PLAYER_MAT_CONFIGURATIONS = {
  INDUSTRIAL: {
    name: "industrial",
    number: "1",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [
            { type: ResourceType.Oil },
            { type: ResourceType.Oil },
            { type: ResourceType.Oil, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,
  ENGINEERING: {
    name: "engineering",
    number: "2",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [
            { type: ResourceType.Oil },
            { type: ResourceType.Oil },
            { type: ResourceType.Oil, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,

  MILITANT: {
    name: "militant",
    number: "2a",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [
            { type: ResourceType.Oil },
            { type: ResourceType.Oil, upgradeable: true },
            { type: ResourceType.Oil, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,
  PATRIOTIC: {
    name: "patriotic",
    number: "3",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [{ type: ResourceType.Oil }, { type: ResourceType.Oil }],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,

  INNOVATIVE: {
    name: "innovative",
    number: "3a",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [
            { type: ResourceType.Oil },
            { type: ResourceType.Oil },
            { type: ResourceType.Oil },
          ],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
            { type: ResourceType.Wood, upgradeable: true },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,
  MECHANICAL: {
    name: "mechanical",
    number: "4",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [
            { type: ResourceType.Oil },
            { type: ResourceType.Oil },
            { type: ResourceType.Oil, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,
  AGRICULTURAL: {
    name: "agricultural",
    number: "5",
    startingResources: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Popularity,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    actions: [
      {
        topAction: COMMON_MOVE,
        bottomAction: {
          type: ActionType.Upgrade,
          cost: [{ type: ResourceType.Oil }, { type: ResourceType.Oil }],
          benefitA: [
            {
              type: BenefitType.Upgrade,
              requirements: BenefitRequirement.None,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Power,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_TRADE,
        bottomAction: {
          type: ActionType.Deploy,
          cost: [
            { type: ResourceType.Metal },
            { type: ResourceType.Metal },
            { type: ResourceType.Metal, upgradeable: true },
            { type: ResourceType.Metal, upgradeable: true },
          ],
          benefitA: [
            { type: BenefitType.Mech, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Coin,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_PRODUCE,
        bottomAction: {
          type: ActionType.Build,
          cost: [
            { type: ResourceType.Wood },
            { type: ResourceType.Wood },
            { type: ResourceType.Wood, upgradeable: true },
            { type: ResourceType.Wood, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Structure,
              requirements: BenefitRequirement.None,
              onWorkerHex: true,
            },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            { type: BenefitType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.Popularity,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
      {
        topAction: COMMON_BOLSTER,
        bottomAction: {
          type: ActionType.Enlist,
          cost: [
            { type: ResourceType.Food },
            { type: ResourceType.Food, upgradeable: true },
            { type: ResourceType.Food, upgradeable: true },
          ],
          benefitA: [
            {
              type: BenefitType.Enlistment,
              requirements: BenefitRequirement.None,
            },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            { type: ResourceType.Coin, requirements: BenefitRequirement.None },
            {
              type: BenefitType.CombatCard,
              requirements: BenefitRequirement.Enlistment,
            },
          ],
        },
      },
    ],
  } as PlayerMat,
} as const;

export type PlayerMatType = keyof typeof PLAYER_MAT_CONFIGURATIONS;

export type Ability = {
  title: string;
  description: string;
};

export type FactionMat = {
  faction: FactionTypes;
  name: string;
  startingResources: ResourceType[];
  factionAbility: Ability;
  mechAbilities: Ability[];
  powerEnlistmentBonus: ResourceType[];
  coinEnlistmentBonus: ResourceType[];
  popularityEnlistmentBonus: ResourceType[];
  combatCardEnlistmentBonus: ResourceType[];
};

export const FACTION_MATS: { [key in FactionTypes]: FactionMat } = {
  [FactionTypes.Albian]: {
    faction: FactionTypes.Albian,
    name: "Clan Albian",
    startingResources: [
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
    ],
    factionAbility: {
      title: "Exalt",
      description: "After moving your character, you may place a Flag token on its territory.",
    },
    mechAbilities: [
      {
        title: "Burrow",
        description: "Move across rivers to or from adjacent tunnel territories.",
      },
      {
        title: "Sword",
        description: "Before combat where you are attacking, opponent gets -2 power",
      },
      {
        title: "Shield",
        description: "Before combat where you are defending, gain +2 power",
      },
      {
        title: "Rally",
        description: "Move to any territory where you have a worker or Flag token.",
      }
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Crimea]: {
    faction: FactionTypes.Crimea,
    name: "Crimean Khanate",
    startingResources: [
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
    ],
    factionAbility: {
      title: "Coercion",
      description: "Once per you may spend 1 combat card as if it were any 1 resource token.",
    },
    mechAbilities: [
      {
        title: "Riverwalk",
        description: "Move across rivers to farms and tundra.",
      },
      {
        title: "Wayfare",
        description: "Move from a territory or home base to any inactive faction's home base or your own.",
      },
      {
        title: "Scout",
        description: "Before combat steal 1 of the opponent's combat cards at random.",
      },
      {
        title: "Speed",
        description: "+1 hex per movement.",
      },
    ],
    powerEnlistmentBonus: [
        ResourceType.Power,
        ResourceType.Power,
    ],
    coinEnlistmentBonus: [
        ResourceType.Coin,
        ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
        ResourceType.Popularity,
        ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
        ResourceType.CombatCard,
        ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Nordic]: {
    faction: FactionTypes.Nordic,
    name: "Nordic Kingdoms",
    startingResources: [
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.CombatCard,
    ],
    factionAbility: {
      title: "Swim",
      description: "Your workers may move across rivers.",
    },
    mechAbilities: [
      {
        title: "Riverwalk",
        description: "Move across rivers to forests and mountains.",
      },
      {
        title: "Seaworthy",
        description: "Move to/from lakes and retreat onto adjacent lakes.",
      },
      {
        title: "Artillery",
        description: "Before combat, if you pay 1 power, opponent gets -2 power.",
      },
      {
        title: "Speed",
        description: "+1 hex per movement.",
      },
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Polania]: {
    faction: FactionTypes.Polania,
    name: "Republic of Polania",
    startingResources: [
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
    ],
    factionAbility: {
      title: "Meander",
      description: "Pick up to 2 options per encounter card.",
    },
    mechAbilities: [
      {
        title: "Riverwalk",
        description: "Move across rivers to villages and mountains.",
      },
      {
        title: "Submerge",
        description: "Move to/from lakes and move from any lake to another.",
      },
      {
        title: "Camaraderie",
        description: "In combat, do not loose popularity when forcing an opponent's worker(s) to retreat.",
      },
      {
        title: "Speed",
        description: "+1 hex per movement.",
      },
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Rusviet]: {
    faction: FactionTypes.Rusviet,
    name: "Rusviet Union",
    startingResources: [
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.Power,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
    ],
    factionAbility: {
      title: "Relentless",
      description: "You may choose the same section on your Player Mat as the previous turn(s).",
    },
    mechAbilities: [
      {
        title: "Riverwalk",
        description: "Move across rivers to farms and villages.",
      },
      {
        title: "Township",
        description: "Move between any village you control and the Factory.",
      },
      {
        title: "People's Army",
        description: "In combat where you have at least 1 worker, you may play +1 combat card.",
      },
      {
        title: "Speed",
        description: "+1 hex per movement.",
      },
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Saxony]: {
    faction: FactionTypes.Saxony,
    name: "Saxony Empire",
    startingResources: [
        ResourceType.Power,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
        ResourceType.CombatCard,
    ],
    factionAbility: {
      title: "Dominate",
      description: "There is no limit to the number of stars you can place from completing objectives and winning combat.",
    },
    mechAbilities: [
      {
        title: "Riverwalk",
        description: "Move across rivers to forests and mountains.",
      },
      {
        title: "Underpass",
        description: "Move between any mountain you control and any tunnel.",
      },
      {
        title: "Disarm",
        description: "Before combat on a territory with a tunnel, opponent gets -2 power.",
      },
      {
        title: "Speed",
        description: "+1 hex per movement.",
      },
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
  [FactionTypes.Togawa]: {
    faction: FactionTypes.Togawa,
    name: "Togawa Shogunate",
    startingResources: [
        ResourceType.CombatCard,
        ResourceType.CombatCard,
    ],
    factionAbility: {
      title: "Maikufu",
      description: "After moving your character, you may place an armed Trap token on its territory.",
    },
    mechAbilities: [
      {
        title: "Toka",
        description: "Move across a river (max 1 character or 1 mech per tern)",
      },
      {
        title: "Suiton",
        description: "Move to/from lakes: in combat on a lake, you may play +1 combat card",
      },
      {
        title: "Ronin",
        description: "Before combat where you have exactly 1 unit, gain +2 power",
      },
      {
        title: "Shiobi",
        description: "Move to any territory where you have a Trap token; you may arm the Trap",
      },
    ],
    powerEnlistmentBonus: [
      ResourceType.Power,
      ResourceType.Power,
    ],
    coinEnlistmentBonus: [
      ResourceType.Coin,
      ResourceType.Coin,
    ],
    popularityEnlistmentBonus: [
      ResourceType.Popularity,
      ResourceType.Popularity,
    ],
    combatCardEnlistmentBonus: [
      ResourceType.CombatCard,
      ResourceType.CombatCard,
    ],
  },
};

export type Faction = (typeof FACTIONS)[keyof typeof FACTIONS];

export type Position = {
  x: number;
  y: number;
};

export type ResourceMap = {
  [K in ResourceType]: number;
};

export type PlayerType = "player" | "ai";

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
  lastActionColumn: number | null; // Track last action column used (cannot repeat)
};

export type Building = {
  type: string;
  position: Position;
};

export type TerritoryType =
  | "factory"
  | "forest"
  | "mountain"
  | "village"
  | "tundra"
  | "farm"
  | "lake"
  | "nordic_home"
  | "crimea_home"
  | "saxony_home"
  | "polania_home"
  | "rusviet_home"
  | "albion_home"
  | "togawa_home"
  | "empty";

export type Territory = {
  x: number;
  y: number;
  type: TerritoryType;
  resources: string[];
  controlled: PlayerType | null;
  rivers: RiverEdge[]; // Rivers on the edges of this territory
};

export type RiverEdge = {
  direction: number; // 0-5 for the 6 hex edges (0=E, 1=NE, 2=NW, 3=W, 4=SW, 5=SE)
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

export function createInitialGameState(
  playerFaction: Faction,
  aiFaction: Faction,
  playerMat?: PlayerMatType,
  aiMat?: PlayerMatType,
): GameState {
  return {
    currentTurn: 0,
    currentPlayer: "player",
    player: createPlayerState(
      playerFaction,
      "player",
      playerMat || "INDUSTRIAL",
    ),
    ai: createPlayerState(aiFaction, "ai", aiMat || "ENGINEERING"),
    board: createBoard(),
    gameLog: [],
  };
}

// Helper function to map old faction names to new FactionTypes
function getFactionType(faction: Faction): FactionTypes {
  switch (faction) {
    case FACTIONS.NORDIC:
      return FactionTypes.Nordic;
    case FACTIONS.CRIMEA:
      return FactionTypes.Crimea;
    case FACTIONS.SAXONY:
      return FactionTypes.Saxony;
    case FACTIONS.POLANIA:
      return FactionTypes.Polania;
    case FACTIONS.RUSVIET:
      return FactionTypes.Rusviet;
    default:
      return FactionTypes.Polania;
  }
}

function createPlayerState(
  faction: Faction,
  type: PlayerType,
  playerMatType: PlayerMatType,
): PlayerState {
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

  // Get faction mat data for starting resources
  const factionType = getFactionType(faction);
  const factionMat = FACTION_MATS[factionType];
  const playerMatConfig = PLAYER_MAT_CONFIGURATIONS[playerMatType];

  // Initialize resources from faction mat and player mat
  const resources: ResourceMap = {
    [RESOURCES.COIN]: 0,
    [RESOURCES.POWER]: 0,
    [RESOURCES.POPULARITY]: 0,
    [RESOURCES.WOOD]: 0,
    [RESOURCES.FOOD]: 0,
    [RESOURCES.METAL]: 0,
    [RESOURCES.OIL]: 0,
    [RESOURCES.COMBAT_CARD]: 0,
  };

  // Add faction starting resources
  factionMat.startingResources.forEach((resource) => {
    resources[resource] = (resources[resource] || 0) + 1;
  });

  // Add player mat starting resources
  playerMatConfig.startingResources.forEach((resource) => {
    resources[resource] = (resources[resource] || 0) + 1;
  });

  return {
    faction,
    type,
    resources,
    stars: 0,
    units: {
      workers: 2,
      mechs: 0,
      character: 1,
    },
    position: { x: 0, y: 0 },
    buildings: [],
    completedObjectives: [],
    abilities,
    playerMat: playerMatType,
    lastActionColumn: null,
  };
}

function createBoard(): Board {
  // Hexagonal board representation
  return {
    territories: generateTerritories(),
    factory: { x: 0, y: 0 }, // Center of hexagonal grid
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
        rivers: getRivers(q, r),
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
  if (q === 0 && r === 0) return "factory";
  if (q === 0 && r === 1) return "lake";
  if (q === 0 && r === -1) return "forest";
  if (q === 0 && r === 2) return "forest";
  if (q === 0 && r === -2) return "lake";
  if (q === 0 && r === 3) return "village";
  if (q === 0 && r === -3) return "farm";
  if (q === 0 && r === -4) return "albion_home";

  if (q === 1 && r === 0) return "mountain";
  if (q === 1 && r === 1) return "village";
  if (q === 1 && r === -1) return "lake";
  if (q === 1 && r === 2) return "mountain";
  if (q === 1 && r === -2) return "tundra";
  if (q === 1 && r === 3) return "farm";
  if (q === 1 && r === -3) return "village";

  if (q === 2 && r === 0) return "tundra";
  if (q === 2 && r === 1) return "lake";
  if (q === 2 && r === -1) return "forest";
  if (q === 2 && r === 2) return "tundra";
  if (q === 2 && r === -2) return "mountain";
  if (q === 2 && r === 3) return "togawa_home";
  if (q === 2 && r === -3) return "forest";

  if (q === 3 && r === 0) return "mountain";
  if (q === 3 && r === -1) return "village";
  if (q === 3 && r === -2) return "farm";
  if (q === 3 && r === -3) return "tundra";
  if (q === 3 && r === -4) return "nordic_home";

  if (q === 4 && r === -1) return "rusviet_home";
  if (q === 4 && r === -2) return "farm";
  if (q === 4 && r === 3) return "empty";
  if (q === 4 && r === -3) return "village";

  if (q === -1 && r === 0) return "lake";
  if (q === -1 && r === 1) return "tundra";
  if (q === -1 && r === -1) return "mountain";
  if (q === -1 && r === 2) return "tundra";
  if (q === -1 && r === -2) return "tundra";
  if (q === -1 && r === 3) return "mountain";
  if (q === -1 && r === -3) return "mountain";

  if (q === -2 && r === 0) return "village";
  if (q === -2 && r === 1) return "farm";
  if (q === -2 && r === -1) return "forest";
  if (q === -2 && r === 2) return "village";
  if (q === -2 && r === -2) return "lake";
  if (q === -2 && r === 3) return "farm";
  if (q === -2 && r === 4) return "village";

  if (q === -3 && r === 0) return "farm";
  if (q === -3 && r === 1) return "forest";
  if (q === -3 && r === -1) return "polania_home";
  if (q === -3 && r === 2) return "village";
  if (q === -3 && r === 3) return "lake";
  if (q === -3 && r === 4) return "crimea_home";

  if (q === -4 && r === 1) return "forest";
  if (q === -4 && r === 2) return "mountain";
  if (q === -4 && r === 3) return "tundra";

  if (q === -5 && r === 3) return "saxony_home";

  return "empty";
}

export function applyAction(
  gameState: GameState,
  player: PlayerType,
  action: GameAction,
  columnIndex?: number,
): GameState {
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
    const column = mat.actions[columnIndex];

    // Execute bottom row action
    if (column && column.bottomAction) {
      executeBottomAction(newState, player, column.bottomAction.type);

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
      action: "Produced resources",
      details: "+2 Wood, +1 Food",
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
      action: "Traded",
      details: "-2 Wood, +3 Coins",
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
      action: "Bolstered",
      details: "+2 Power, +1 Popularity",
    });
  }

  return gameState;
}

function handleMove(
  gameState: GameState,
  player: PlayerType,
  action: GameAction,
): GameState {
  const playerState = gameState[player];

  // Simple movement
  if (action.destination) {
    playerState.position = action.destination;

    gameState.gameLog.push({
      turn: gameState.currentTurn,
      player,
      action: "Moved",
      details: `to (${action.destination.x}, ${action.destination.y})`,
    });
  }

  return gameState;
}

function handleBuild(
  gameState: GameState,
  player: PlayerType,
  action: GameAction,
): GameState {
  const playerState = gameState[player];

  // Build structure
  if (
    playerState.resources[RESOURCES.WOOD] >= 3 &&
    playerState.resources[RESOURCES.COIN] >= 2
  ) {
    playerState.resources[RESOURCES.WOOD] -= 3;
    playerState.resources[RESOURCES.COIN] -= 2;

    if (action.buildingType) {
      playerState.buildings.push({
        type: action.buildingType,
        position: playerState.position,
      });

      gameState.gameLog.push({
        turn: gameState.currentTurn,
        player,
        action: "Built",
        details: action.buildingType,
      });
    }
  }

  return gameState;
}

export function switchTurn(gameState: GameState): GameState {
  const newState = { ...gameState };
  newState.currentPlayer =
    newState.currentPlayer === "player" ? "ai" : "player";
  if (newState.currentPlayer === "player") {
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
  for (let i = 0; i < mat.actions.length; i++) {
    if (playerState.lastActionColumn !== i) {
      availableColumns.push(i);
    }
  }

  return availableColumns;
}

/**
 * Execute bottom row action based on type
 */
function executeBottomAction(
  gameState: GameState,
  player: PlayerType,
  actionType: ActionType,
): void {
  const playerState = gameState[player];

  switch (actionType) {
    case ACTIONS.UPGRADE:
      // Upgrade: Gain 1 coin reduction on future actions
      playerState.resources[RESOURCES.COIN] += 1;
      gameState.gameLog.push({
        turn: gameState.currentTurn,
        player,
        action: "Upgraded",
        details: "Infrastructure improved",
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
          action: "Deployed",
          details: "Mech deployed",
        });
      }
      break;

    case ACTIONS.BUILD:
      // Build: Construct building
      if (
        playerState.resources[RESOURCES.WOOD] >= 3 &&
        playerState.resources[RESOURCES.COIN] >= 2
      ) {
        playerState.resources[RESOURCES.WOOD] -= 3;
        playerState.resources[RESOURCES.COIN] -= 2;
        playerState.buildings.push({
          type: "structure",
          position: playerState.position,
        });
        gameState.gameLog.push({
          turn: gameState.currentTurn,
          player,
          action: "Built",
          details: "Structure erected",
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
          action: "Enlisted",
          details: "Recruit joined",
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
  destination: Position,
): boolean {
  const playerState = gameState[player];
  const destTerritory = gameState.board.territories.find(
    (t) => t.x === destination.x && t.y === destination.y,
  );

  if (!destTerritory) return false;

  // Check if destination is a lake
  if (destTerritory.type === "lake") {
    // Need lake ability to move to lakes
    return playerState.abilities.lakes;
  }

  // Check if there's a river between source and destination
  const sourceTerritory = gameState.board.territories.find(
    (t) => t.x === sourcePos.x && t.y === sourcePos.y,
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
  if (dx === 1 && dy === 0)
    direction = 0; // East
  else if (dx === 1 && dy === -1)
    direction = 1; // Northeast
  else if (dx === 0 && dy === -1)
    direction = 2; // Northwest
  else if (dx === -1 && dy === 0)
    direction = 3; // West
  else if (dx === -1 && dy === 1)
    direction = 4; // Southwest
  else if (dx === 0 && dy === 1) direction = 5; // Southeast

  // Check if this edge has a river
  return territory.rivers.some((river) => river.direction === direction);
}
