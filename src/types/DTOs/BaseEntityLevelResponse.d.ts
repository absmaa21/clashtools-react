import {ResourceType} from "../../enums/ResourceType.ts";

interface BaseEntityLevelResponse {
  id: number,
  level: number,
  attributes: unknown[],
  resourceType: ResourceType,
  upgradeCost: number,
  upgradeTime: number,
  imgPath: string,
}