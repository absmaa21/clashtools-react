/**
 * Base type for every level of an entity
 */
interface EntityLevel {
  id: number,
  level: number,
  cost: number,
  resource: ResourceType,
  upgradeTime: number,
  imgPath: string,
}