import "./routes"
import Koa from "koa"
import { koaBody } from "koa-body"
import { router } from "./routes"

export const app = new Koa()

app
  .use(
    koaBody({
      multipart: true,
      formidable: { keepExtensions: true, multiples: true }
    })
  )
  .use(router.routes())
  .use(router.allowedMethods())

export * from "./routes"
export * from "./collections"
