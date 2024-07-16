import "./routes"
import { BridgeAPI } from "@heraclius/backend-bridge"
import Koa from "koa"
import { koaBody } from "koa-body"
import { router } from "./routes"

export const app = new Koa()

app.use(koaBody()).use(router.routes()).use(router.allowedMethods()).listen(10000)

await BridgeAPI.connect("storage", "http://localhost:10000")
