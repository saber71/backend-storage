import { FileCollection, type ICollection, MemoryCollection, SqlCollection } from "@heraclius/collection"

const memoryCollections: Record<string, ICollection> = {}
const fileCollections: Record<string, ICollection> = {}
const sqlCollections: Record<string, ICollection> = {}

const classMap = {
  sql: SqlCollection,
  file: FileCollection,
  memory: MemoryCollection
}

export type CollectionType = "sql" | "file" | "memory"

export interface BaseParam {
  name: string
  type?: CollectionType
}

function getCollectionCache(type: CollectionType) {
  if (type === "sql") return sqlCollections
  else if (type === "file") return fileCollections
  return memoryCollections
}

export function getCollection(name: string, type: CollectionType = "sql") {
  const cache = getCollectionCache(type)
  let result = cache[name]
  if (!result) result = cache[name] = new classMap[type](name, true) as any
  return result
}
