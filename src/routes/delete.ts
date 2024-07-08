import type { QueryCondition, QueryItem } from "@heraclius/query"
import { type BaseParam, getCollection } from "../collections.ts"
import { router } from "./router.ts"

interface Body extends BaseParam {
  query?: QueryCondition<QueryItem>
  id?: string
  returnResult?: boolean
}

router.post("/delete", async (context, next) => {
  const body: Body = context.request.body
  const collection = getCollection(body.name, body.type)
  if (body.id) await collection.deleteById(body.id)
  else if (body.query) {
    const result = await collection.delete(body.query)
    if (body.returnResult) {
      context.response.body = result
      context.response.type = "application/json"
    }
  }
  next()
})
