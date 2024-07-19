import type { QueryItem } from "@heraclius/query"
import { type BaseParam, getCollection } from "../collections.ts"
import { router } from "./router.ts"

interface Body extends BaseParam {
  value: QueryItem[]
}

router.post("/update", async (context, next) => {
  const body: Body = context.request.body
  const query = context.request.query
  const collection = getCollection(body.name, body.type, query.tid as any)
  await collection.update(...body.value)
  context.response.body = ""
  next()
})
