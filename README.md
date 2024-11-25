# @tomsd/mongodbclient

It's a handy mongodb client for easy-use.  
See [mongodbclient.netlify.app](https://mongodbclient.netlify.app/) for details.

![npm](https://img.shields.io/npm/v/@tomsd/mongodbclient?style=for-the-badge&logo=npm)
![NPM](https://img.shields.io/npm/l/@tomsd/mongodbclient?style=for-the-badge&logo=npm)
![release date](https://img.shields.io/github/release-date/tomsdoo/mongodbclient?style=for-the-badge&logo=npm)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@tomsd/mongodbclient?style=for-the-badge&logo=npm)

![ci](https://img.shields.io/github/actions/workflow/status/tomsdoo/mongodbclient/ci.yml?style=social&logo=github)
![checks](https://img.shields.io/github/check-runs/tomsdoo/mongodbclient/main?style=social&logo=github)
![top language](https://img.shields.io/github/languages/top/tomsdoo/mongodbclient?style=social&logo=typescript)
![Maintenance](https://img.shields.io/maintenance/yes/2024?style=social&logo=github)
![depends on mongodb@6](https://img.shields.io/badge/mongodb-mongodb@6-informational?style=social&logo=mongodb)
![depends on node greater or equal 18](https://img.shields.io/badge/node.js-%3E%3D%2018-lightyellow?style=social&logo=nodedotjs)

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

  const itemLength = await mdbc.count();
  console.log(`count: ${itemLength}`); // 4

  const { deletedCount } = await mdbc.remove({});
  console.log(`deletedCount: ${deletedCount}`); // 4

})();

```
