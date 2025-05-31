import {ResourceType} from "../enums/ResourceType.ts";

export function getResourceByType(type: ResourceType): string {
  switch (type) {
    case ResourceType.GOLD: return 'https://static.wikia.nocookie.net/clashofclans/images/1/10/Gold.png'
    case ResourceType.ELIXIR: return 'https://static.wikia.nocookie.net/clashofclans/images/4/43/Elixir.png'
    case ResourceType.DARK_ELIXIR: return 'https://static.wikia.nocookie.net/clashofclans/images/4/4e/Dark_Elixir.png'
    case ResourceType.SHINY_ORE: return 'https://static.wikia.nocookie.net/clashofclans/images/d/da/Shiny_Ore.png'
    case ResourceType.GLOWY_ORE: return 'https://static.wikia.nocookie.net/clashofclans/images/7/72/Glowy_Ore.png'
    case ResourceType.STARRY_ORE: return 'https://static.wikia.nocookie.net/clashofclans/images/0/07/Starry_Ore.png'
    case ResourceType.GEMS: return 'https://static.wikia.nocookie.net/clashofclans/images/2/20/Gem_info.png'
    case ResourceType.RAID_MEDALS: return 'https://static.wikia.nocookie.net/clashofclans/images/5/52/Raid_Medal.png'
  }
}