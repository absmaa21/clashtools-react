interface BaseEntityResponse {
  id: number,
  name: string,
  categoryId: Category,
  baseEntityLevels: EntityLevel[],
  maxAllowed?: number,
}