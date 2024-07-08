import type { QueryItem } from "@heraclius/query"
import { type BaseParam, getCollection } from "../collections.ts"
import { router } from "./router.ts"

interface Body extends BaseParam {
  value: QueryItem[]
}

router.post("/update", async (context, next) => {
  const body: Body = context.request.body
  const collection = getCollection(body.name, body.type)
  await collection.update(...body.value)
  next()
})
