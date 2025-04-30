import {Category} from "../enums/Category.ts";
import {ResourceType} from "../enums/ResourceType.ts";

export const demoEntities: Entity[] = [
  {
    id: "hero_001",
    name: "Barbarian King",
    category: Category.HERO,
    maxLevel: 100,
    levels: [
      {
        id: "bk_lvl_1",
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
        id: "bk_lvl_5",
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
    id: "troop_001",
    name: "Archer",
    category: Category.TROOP,
    maxLevel: 18,
    levels: [
      {
        id: "archer_lvl_1",
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
        id: "archer_lvl_3",
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
    id: "defense_001",
    name: "Archer Tower",
    category: Category.DEFENSE,
    maxLevel: 21,
    levels: [
      {
        id: "archertower_lvl_1",
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
        id: "archertower_lvl_5",
        level: 5,
        stats: [
          { key: "Hitpoints", value: 620 },
          { key: "Damage per Second", value: 30 },
          { key: "Range", value: 10 },
        ],
        resource: ResourceType.GOLD,
        cost: 20000,
        upgradeTime: 60 * 60,
        imgPath: 'https://static.wikia.nocookie.net/clashofclans/images/e/e8/Archer_Tower5.png',
      },
    ],
  },

]