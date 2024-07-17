import { setDefaultType } from "../collections.ts"
import { router } from "./router.ts"

router.post("/collection/default", async (context, next) => {
  setDefaultType(context.request.query.type as any)
  context.response.body = context.request.query.type
  await next()
})
