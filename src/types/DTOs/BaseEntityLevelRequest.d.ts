import {ResourceType} from "../../enums/ResourceType.ts";

interface BaseEntityLevelRequest {
  baseEntityId: number,
  levelId: number,
  attributeIds?: number[],
  resourceType: ResourceType,
  upgradeCost: number,
  upgradeTime: number,
  imgPath: string,
}