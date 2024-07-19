import type { QueryItem } from "@heraclius/query"
import { type BaseParam, getCollection } from "../collections.ts"
import { router } from "./router.ts"

interface Body extends BaseParam {
  value: QueryItem[]
  returnResult?: boolean
}

router.post("/save", async (context, next) => {
  const body: Body = context.request.body
  const query = context.request.query
  const collection = getCollection(body.name, body.type, query.tid as any)
  const result = await collection.save(...body.value)
  if (body.returnResult) {
    context.response.body = result
    context.response.type = "application/json"
  } else {
    context.response.body = ""
  }
  await next()
})
