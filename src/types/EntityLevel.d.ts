/**
 * Base type for every level of an entity
 */
interface EntityLevel {
  id: string,
  level: number,
  stats: EntityStat[],
  cost: number,
  resource: ResourceType,
  upgradeTime: number,
  imgPath: string,
}