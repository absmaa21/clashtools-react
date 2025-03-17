/**
 * Base type from which most objects extend.
 */
interface Entity {
  id: string,
  name: string,
  category: Category,
  stats: EntityStat[],
}