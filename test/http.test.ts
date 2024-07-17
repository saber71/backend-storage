import { httpTest, setDefaultAxiosConfig } from "@heraclius/http-test"
import "@heraclius/backend-bridge/dist/www.js"
import { describe, test } from "vitest"
import "../src"

setDefaultAxiosConfig({
  baseURL: "http://localhost:10001"
})

describe.sequential("http", () => {
  test("default collection type", async () => {
    await httpTest({
      url: "/storage/collection/default?type=file",
      method: "post"
    })
      .expectBody("file")
      .expectStatus(200)
      .done()
  })
  test("save", async () => {
    await httpTest({
      url: "/storage/save",
      method: "post",
      data: {
        name: "test",
        type: "memory",
        value: [
          { name: "heraclius", age: 18, _id: "1" },
          { name: "heraclius", age: 28, _id: "2" }
        ],
        returnResult: true
      }
    })
      .expectBody([
        { name: "heraclius", age: 18, _id: "1" },
        { name: "heraclius", age: 28, _id: "2" }
      ])
      .expectStatus(200)
      .done()
  })

  test("update", async () => {
    await httpTest(() => ({
      url: "/storage/update",
      method: "post",
      data: {
        name: "test",
        type: "memory",
        value: [{ age: 20, _id: "1" }]
      }
    }))
      .expectStatus(200)
      .done()
  })

  test("delete", async () => {
    await httpTest(() => ({
      url: "/storage/delete",
      method: "post",
      data: {
        name: "test",
        type: "memory",
        returnResult: true,
        query: { _id: "1" }
      }
    }))
      .expectStatus(200)
      .expectBody([
        {
          name: "heraclius",
          age: 20,
          _id: "1"
        }
      ])
      .done()
  })

  test("search", async () => {
    await httpTest(() => ({
      url: "/storage/search",
      method: "post",
      data: {
        name: "test",
        type: "memory",
        query: {
          name: "heraclius"
        },
        single: true
      }
    }))
      .expectStatus(200)
      .expectBody({
        name: "heraclius",
        age: 28,
        _id: "2"
      })
      .done()
  })

  test("get-by-id", async () => {
    await httpTest(() => ({
      url: "/storage/get",
      method: "get",
      params: {
        name: "test",
        type: "memory",
        id: "2"
      }
    }))
      .expectStatus(200)
      .expectBody({
        name: "heraclius",
        age: 28,
        _id: "2"
      })
      .done()
  })
})
