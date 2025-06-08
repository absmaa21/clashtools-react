import {BaseEntityLevelResponse} from "./BaseEntityLevelResponse";

interface BaseEntityResponse {
  id: number,
  name: string,
  categoryId: Category,
  baseEntityLevels: BaseEntityLevelResponse[],
  maxAllowed?: number,
}