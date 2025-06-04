/**
 * Base type from which most objects extend.
 */
interface Entity {
  id: number,
  name: string,
  category: Category,
  levels: EntityLevel[],
  maxAllowed?: number,
}