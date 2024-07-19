import { Transaction } from "@heraclius/collection"
import { getCollection, setDefaultType } from "../collections.ts"
import { router } from "./router.ts"

const defaultCollection = getCollection("", "memory")

router.post("/collection/default", async (context, next) => {
  setDefaultType(context.request.query.type as any)
  context.response.body = context.request.query.type
  await next()
})

router.post("/transaction/end", async (context, next) => {
  const query = context.request.query
  const tid = query.tid as any
  const rollback = query.rollback as any
  const transaction = Transaction.get(tid, defaultCollection)
  if (rollback) await transaction.rollback()
  else transaction.end()
  await next()
})
