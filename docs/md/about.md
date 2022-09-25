# @tomsd/mongodbclient

It's a handy mongodb client for easy-use.

## installation
``` shell
npm install @tomsd/mongodbcliekt
```

## usage
``` typescript
import { MClient } from "@tomsd/mongodbclient";

const [ uri, dbName, collectionName ] = [
  "mongodb+srv://...",
  "dbName",
  "collectionName"
];

const mdbc = new MClient(uri, dbName, collectionName);

const items = [
  { name: "alice" },
  { name: "bob" }
];

console.log(
  await mdbc.insertMany(items)
    .then(({ insertedCount}) => insertedCount)
); // 2

const docs = await mdbc.read();
await mdbc.upsert({
  ...docs[0],
  name: "charlie"
});
```
