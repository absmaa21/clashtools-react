export enum ResourceType {
  GOLD,
  ELIXIR,
  DARK_ELIXIR,
  SHINY_ORE,
  GLOWY_ORE,
  STARRY_ORE,
  RAID_MEDALS,
  GEMS,
}


export const resourceImg: Record<ResourceType, string> = {
  [ResourceType.GOLD]: 'https://static.wikia.nocookie.net/clashofclans/images/1/10/Gold.png',
  [ResourceType.ELIXIR]: 'https://static.wikia.nocookie.net/clashofclans/images/4/43/Elixir.png',
  [ResourceType.DARK_ELIXIR]: 'https://static.wikia.nocookie.net/clashofclans/images/4/4e/Dark_Elixir.png',
  [ResourceType.SHINY_ORE]: 'https://static.wikia.nocookie.net/clashofclans/images/d/da/Shiny_Ore.png',
  [ResourceType.GLOWY_ORE]: 'https://static.wikia.nocookie.net/clashofclans/images/7/72/Glowy_Ore.png',
  [ResourceType.STARRY_ORE]: 'https://static.wikia.nocookie.net/clashofclans/images/0/07/Starry_Ore.png',
  [ResourceType.RAID_MEDALS]: 'https://static.wikia.nocookie.net/clashofclans/images/5/52/Raid_Medal.png',
  [ResourceType.GEMS]: 'https://static.wikia.nocookie.net/clashofclans/images/a/aa/Gem.png',
};