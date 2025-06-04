import {Category} from "../enums/Category.ts";
import {ResourceType} from "../enums/ResourceType.ts";

export const demoEntities: Entity[] = [
  {
    id: 1,
    name: "Barbarian King",
    category: Category.HERO,
    levels: [
      {
        id: 454,
        level: 1,
        stats: [
          { key: "Hitpoints", value: 1300 },
          { key: "Damage per Second", value: 120 },
          { key: "Ability", value: "Iron Fist" },
          { key: "Regeneration Time", value: "10m" },
        ],
        resource: ResourceType.DARK_ELIXIR,
        cost: 1000,
        upgradeTime: 0,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/2/26/Avatar_Hero_Barbarian_King.png',
      },
      {
        id: 1543654362,
        level: 5,
        stats: [
          { key: "Hitpoints", value: 1550 },
          { key: "Damage per Second", value: 145 },
          { key: "Ability", value: { name: "Iron Fist", levelUnlocked: 5 } },
          { key: "Regeneration Time", value: "12m" },
        ],
        resource: ResourceType.DARK_ELIXIR,
        cost: 8000,
        upgradeTime: 18 * 60 * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/2/26/Avatar_Hero_Barbarian_King.png',
      },
    ],
  },
  {
    id: 28452,
    name: "Archer",
    category: Category.TROOP,
    levels: [
      {
        id: 30704354,
        level: 1,
        stats: [
          { key: "Hitpoints", value: 20 },
          { key: "Damage per Second", value: 7 },
          { key: "Range", value: 3.5 },
        ],
        resource: ResourceType.ELIXIR,
        cost: 0,
        upgradeTime: 0,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/e/ee/Archer1.png',
      },
      {
        id: 13834,
        level: 3,
        stats: [
          { key: "Hitpoints", value: 28 },
          { key: "Damage per Second", value: 11 },
          { key: "Range", value: 3.5 },
        ],
        resource: ResourceType.ELIXIR,
        cost: 10000,
        upgradeTime: (5 * 60 + 30) * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/f/f6/Archer3.png',
      },
    ],
  },
  {
    id: 1468,
    name: "Archer Tower",
    category: Category.DEFENSE,
    levels: [
      {
        id: 58364,
        level: 1,
        stats: [
          { key: "Hitpoints", value: 380 },
          { key: "Damage per Second", value: 11 },
          { key: "Range", value: 10 },
        ],
        resource: ResourceType.GOLD,
        cost: 1000,
        upgradeTime: 10,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/6/6e/Archer_Tower1.png',
      },
      {
        id: 4828,
        level: 2,
        stats: [],
        resource: ResourceType.GOLD,
        cost: 70_000,
        upgradeTime: 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/e/e8/Archer_Tower5.png',
      },
      {
        id: 974,
        level: 3,
        stats: [],
        resource: ResourceType.GOLD,
        cost: 4_000_000,
        upgradeTime: 60 * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/f/fa/Archer_Tower21.png',
      },
    ],
  },
  {
    id: 4574,
    name: 'Cannon',
    category: Category.DEFENSE,
    levels: [
      {
        id: 24572,
        level: 1,
        stats: [],
        resource: ResourceType.GOLD,
        cost: 250,
        upgradeTime: 5,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/a/a1/Cannon1.png',
      },
      {
        id: 2457,
        level: 2, // 20
        stats: [],
        resource: ResourceType.GOLD,
        cost: 2_600_000,
        upgradeTime: (24 + 12) * 60 * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/7/71/Cannon20B.png',
      },
      {
        id: 245756,
        level: 3, // 21
        stats: [],
        resource: ResourceType.GOLD,
        cost: 3_000_000,
        upgradeTime: (2 * 24) * 60 * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/8/85/Cannon21B.png',
      },
    ],
  },
]


export const demoAccountEntities: AccountEntity[] = [
  // ARCHER TOWERS
  {
    id: 64,
    entity: demoEntities[2],
    level: 0,
  },
  {
    id: 523435277,
    entity: demoEntities[2],
    level: 1,
    upgradeStart: Date.now() - (demoEntities[2].levels[1].upgradeTime / 1.5) * 1000,
  },
  {
    id: 452683,
    entity: demoEntities[2],
    level: 2,
    upgradeStart: Date.now() - (demoEntities[2].levels[2].upgradeTime / 2) * 1000,
  },
  {
    id: 98765345,
    entity: demoEntities[2],
    level: 3,
  },

  // CANNONS
  {
    id: 563473,
    entity: demoEntities[3],
    level: 0,
  },
  {
    id: 87654345,
    entity: demoEntities[3],
    level: 20,
    upgradeStart: Date.now() - (demoEntities[3].levels[2].upgradeTime / 1.7) * 1000,
  },
  {
    id: 574383,
    entity: demoEntities[3],
    level: 21,
  },

  // ARCHER
  {
    id: 5754,
    entity: demoEntities[1],
    level: 0,
  },
]