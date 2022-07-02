# @tomsd/mongodbclient

## Installation
``` sh
npm install @tomsd/mongodbclient
```

# Usage

``` typescript
import { MClient } from "@tomsd/mongodbclient";

const uri = "mongodb+srv://...";
const dbName = "mydb";
const collectionName = "mycollection";

const mdbc = new MClient(uri, dbName, collectionName);

const items = [
  { name: "alice" },
  { name: "bob" },
  { name: "charlie" },
  { name: "alice" }
];

(async () => {
  const { insertedCount } = await mdbc.insertMany(items);
  console.log(insertedCount); // 4

  const collections = await mdbc.getCollections();
  console.log(
    collections.some(
      // @ts-ignore
      collection => collection.s.namespace.db === dbName
    )
  ); // true

  const docs = await mdbc.read();
  console.log(docs);

  const { upsertedCount, modifiedCount } = await mdbc.upsert({
    ...docs[0],
    name: "david"
  });
  console.log(`upsertedCount: ${upsertedCount}, modifiedCount: ${modifiedCount}`);

  const names = await mdbc.distinct("name");
  console.log(`distinct names: ${names.length}`); // 4

  const { storageSize } = await mdbc.stats();
  console.log(`storageSize: ${storageSize}`);

  const itemLength = await mdbc.count();
  console.log(`count: ${itemLength}`); // 4

  const { deletedCount } = await mdbc.remove({});
  console.log(`deletedCount: ${deletedCount}`); // 4

})();

```
