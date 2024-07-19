import { Select } from "@heraclius/collection"
import { type QueryCondition, type QueryItem } from "@heraclius/query"
import { type BaseParam, getCollection } from "../collections.ts"
import { router } from "./router.ts"

interface UrlQueries extends BaseParam {
  id: string
  tid?: string
}

router.get("/get", async (context, next) => {
  const params = context.query as any as UrlQueries
  const collection = getCollection(params.name, params.type, params.tid)
  const result = await collection.getById(params.id)
  if (result) {
    context.response.body = result
    context.response.type = "application/json"
  }
  await next()
})

interface JoinQuery extends BaseParam {
  // 当想要使用join过程中的对象的属性值时，就写成类似于'$.abc.anc[0]'
  query?: QueryCondition<QueryItem>
  queryOne?: QueryCondition<QueryItem>
  // join时的查询回调函数字符串，使用$访问搜索对象，collection访问join的集合
  queryFn?: string
  // 导出join结果的回调函数字符串，使用$访问join的结果
  exposeFn?: string
}

interface Body extends BaseParam {
  query?: QueryCondition<QueryItem>
  // 导出join结果的回调函数字符串，使用$访问join的结果
  exposeFn?: string
  single?: boolean
  join?: Array<JoinQuery>
}

router.post("/search", async (context, next) => {
  const body: Body = context.request.body
  const query = context.request.query
  context.response.body = await handleSearch(body, query.tid as any)
  context.response.type = "application/json"
  await next()
})

export async function handleSearch(body: Body, tid?: string) {
  const collection = getCollection(body.name, body.type, tid)
  const select = Select.from(collection)
  select.where(body.query)
  if (body.exposeFn) {
    const callback = new Function("$", body.exposeFn)
    select.expose(collection, callback as any)
  }
  if (body.join) {
    for (let join of body.join) {
      const collection = getCollection(join.name, join.type)
      const callback = join.queryFn ? new Function("$", "collection", join.queryFn) : undefined
      const queryPatcher = !callback && join.query ? patchQuery(join.query) : []
      const queryOnePatcher = !callback && join.queryOne ? patchQuery(join.queryOne) : []
      select.join(collection, async (val) => {
        queryOnePatcher.forEach((fn) => fn(val))
        queryPatcher.forEach((fn) => fn(val))
        let result: any
        if (callback) result = await callback(val, collection)
        else if (join.queryOne) result = await collection.searchOne(join.queryOne)
        else if (join.query) result = await collection.search(join.query)
        else result = await collection.search()
        return result
      })
      if (join.exposeFn) {
        const callback = new Function("$", join.exposeFn)
        select.expose(collection, callback as any)
      }
    }
  }
  let result: any
  if (body.single) result = await select.toOne()
  else result = await select.toArray()
  return result
}

function patchQuery(condition: QueryCondition<QueryItem>) {
  const result: Array<(value: any) => void> = []
  recursive(condition)
  return result

  function recursive(obj: any) {
    for (let key in obj) {
      const value = obj[key]
      if (value instanceof Array) {
        value.forEach(recursive)
      } else if (typeof value === "object") {
        recursive(value)
      } else if (typeof value === "string" && value[0] === "$") {
        const fn = new Function("$", "return " + value)
        result.push((value) => (obj[key] = fn(value)))
      }
    }
  }
}
