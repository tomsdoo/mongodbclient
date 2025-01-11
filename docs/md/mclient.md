# MClient

`MClient` class is exported from [@tomsd/mongodbclient](https://www.npmjs.com/package/@tomsd/mongodbclient).

``` mermaid
classDiagram
class MClient {
  +constructor(uri: string, db: string, collection: string)
  +upsert(pobj: any) Promise~UpdateResult~
  +read~T~(condition: any, opt?: any) Promise~T[]~
  +distinct~T~(key: string, condition?: any) Promise~T[]~
  +remove(condition: any) Promise~DeleteResult~
  +count(condition?: any) Promise~number~
  +insertMany(items: any[]) Promise~InsertManyResult~
  +stats() Promise~CollStats~
  +dbStats() Promise~Document~
}
```
***

## read()

``` typescript
read<T = WithId<Document>>(condition: any, opt?: any) => Promise<T[]>
```
### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|condition|Yes|`{ name: "test" }`|condition to read|
|2|opt|No|`{ limit: 1 }`|[FindOptions](https://mongodb.github.io/node-mongodb-native/4.10/interfaces/FindOptions.html)|

***

## upsert()

``` typescript
upsert(pobj: any) => Promise<UpdateResult>
```

### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|pobj|Yes|`{ name: "test" }`|object to be upserted|

***

## distinct()

``` typescript
distinct<T = any>(key: string, condition: any = {}) => Promise<T[]>
```

### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|key|Yes|`"name"`|key field name|
|2|condition|No|`{ gender: "male" }`|condition to find|

***

## remove()

``` typescript
remove(condition: any) => Promise<DeleteResult>
```

### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|condition|Yes|`{ gender: "male" }`|condition to find|

***

## count()

``` typescript
count(condition: any) => Promise<number>
```

### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|condition|No|`{ gender: "male" }`|condition to find|

***

## insertMany()

``` typescript
insertMany(items: any[]) => Promise<InsertManyResult<Document>>
```

### parameters
|#|name|required|example|description|
|--:|:--|:--|:--|:--|
|1|items|Yes|`[{ name: "bob", gender: "male" }]`|items to be inserted|
