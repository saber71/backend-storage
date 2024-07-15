import { describe, expect, it } from "vitest"
import { getCollection } from "../src/collections"
import { handleSearch } from "../src/routes"

const collection = getCollection("test", "memory")
const collection2 = getCollection("test2", "memory")
collection.save(
  {
    field: "value1",
    age: 10,
    _id: "1"
  },
  { field: "value2", age: 10, _id: "2" },
  { field: "value3", age: 30, _id: "3" }
)
collection2.save(
  {
    _id: "11",
    name: "value1",
    age: 10
  },
  {
    _id: "12",
    name: "value2",
    age: 20
  }
)

describe("handleSearch", () => {
  it("should handle basic search without joins or expose functions", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { field: "value1" }
    })
    expect(result).toEqual([
      {
        field: "value1",
        age: 10,
        _id: "1"
      }
    ])
  })

  it("should handle search with expose function", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { field: "value1" },
      exposeFn: "return { age: $.age };"
    })
    expect(result).toEqual([{ age: 10 }])
  })

  it("should handle search with join and query function", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { field: "value1" },
      join: [
        {
          name: "test2",
          type: "memory",
          queryFn: "return collection.searchOne({ name: $.field });"
        }
      ]
    })
    expect(result).toEqual([
      {
        field: "value1",
        name: "value1",
        age: 10,
        _id: "11"
      }
    ])
  })

  it("should handle search with join and query", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { field: "value1" },
      join: [
        {
          name: "test2",
          type: "memory",
          queryOne: { name: "$.field" }
        }
      ]
    })
    expect(result).toEqual([
      {
        field: "value1",
        name: "value1",
        age: 10,
        _id: "11"
      }
    ])
  })

  it("should handle search with join and expose function", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { age: 10 },
      join: [
        {
          name: "test2",
          type: "memory",
          exposeFn: "return {test2:$};"
        }
      ]
    })
    expect(result).toEqual([
      {
        field: "value1",
        age: 10,
        _id: "1",
        test2: [
          {
            _id: "11",
            name: "value1",
            age: 10
          },
          {
            _id: "12",
            name: "value2",
            age: 20
          }
        ]
      },
      {
        field: "value2",
        age: 10,
        _id: "2",
        test2: [
          {
            _id: "11",
            name: "value1",
            age: 10
          },
          {
            _id: "12",
            name: "value2",
            age: 20
          }
        ]
      }
    ])
  })

  it("should handle single result search", async () => {
    const result = await handleSearch({
      name: "test",
      type: "memory",
      query: { field: "value1" },
      single: true
    })
    expect(result).toEqual({
      field: "value1",
      age: 10,
      _id: "1"
    })
  })
})
