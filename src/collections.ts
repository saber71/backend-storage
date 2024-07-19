import { FileCollection, type ICollection, MemoryCollection, SqlCollection, Transaction } from "@heraclius/collection"

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

let defaultType: CollectionType = "file"

export function setDefaultType(type?: CollectionType | null) {
  if (!type) throw new Error("type is null")
  defaultType = type
}

export function getCollection(name: string, type?: CollectionType | null, transactionId?: string) {
  if (!type) type = defaultType
  const cache = getCollectionCache(type)
  let result = cache[name]
  if (!result) result = cache[name] = new classMap[type](name, true) as any
  if (transactionId) result = Transaction.get(transactionId, result)
  return result
}
