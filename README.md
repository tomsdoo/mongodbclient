# @tomsd/mongodbclient

It's a handy mongodb client for easy-use.  
See [mongodbclient.netlify.app](https://mongodbclient.netlify.app/) for details.

![npm](https://img.shields.io/npm/v/@tomsd/mongodbclient)
![NPM](https://img.shields.io/npm/l/@tomsd/mongodbclient)
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/@tomsd/mongodbclient)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@tomsd/mongodbclient)
![Maintenance](https://img.shields.io/maintenance/yes/2023)
![depends on mongodb@4](https://img.shields.io/badge/depends%20on-mongodb@4-informational)

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
