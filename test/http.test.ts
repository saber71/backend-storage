import { httpTest, setDefaultAxiosConfig } from "@heraclius/http-test"
import { describe, test } from "vitest"
import "../www.js"

setDefaultAxiosConfig({
  baseURL: "http://localhost:10000"
})

describe.sequential("http", () => {
  test("save", async () => {
    await httpTest(() => ({
      url: "/save",
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
    }))
      .expectBody([
        { name: "heraclius", age: 18, _id: "1" },
        { name: "heraclius", age: 28, _id: "2" }
      ])
      .expectStatus(200)
      .done()
  })

  test("update", async () => {
    await httpTest(() => ({
      url: "/update",
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
      url: "/delete",
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
      url: "/search",
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
      url: "/get",
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
