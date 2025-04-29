import {Category} from "../enums/Category.ts";

export const demoEntities: Entity[] = [
  {
    id: "hero_001",
    name: "Barbarian King",
    category: Category.HERO,
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
      },
    ],
  },
  {
    id: "troop_001",
    name: "Archer",
    category: Category.TROOP,
    levels: [
      {
        id: "archer_lvl_1",
        level: 1,
        stats: [
          { key: "Hitpoints", value: 20 },
          { key: "Damage per Second", value: 7 },
          { key: "Training Cost", value: 50 },
          { key: "Range", value: 3.5 },
        ],
      },
      {
        id: "archer_lvl_3",
        level: 3,
        stats: [
          { key: "Hitpoints", value: 28 },
          { key: "Damage per Second", value: 11 },
          { key: "Training Cost", value: 80 },
          { key: "Range", value: 3.5 },
        ],
      },
    ],
  },
  {
    id: "defense_001",
    name: "Archer Tower",
    category: Category.DEFENSE,
    levels: [
      {
        id: "archertower_lvl_1",
        level: 1,
        stats: [
          { key: "Hitpoints", value: 380 },
          { key: "Damage per Second", value: 11 },
          { key: "Range", value: 10 },
          { key: "Build Cost", value: 1000 },
          { key: "Build Time", value: "15m" },
        ],
      },
      {
        id: "archertower_lvl_5",
        level: 5,
        stats: [
          { key: "Hitpoints", value: 620 },
          { key: "Damage per Second", value: 30 },
          { key: "Range", value: 10 },
          { key: "Build Cost", value: 20000 },
          { key: "Build Time", value: "1h" },
        ],
      },
    ],
  },

]