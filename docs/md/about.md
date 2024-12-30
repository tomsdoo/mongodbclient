# @tomsd/mongodbclient

It's a handy mongodb client for easy-use.  
See [npm @tomsd/mongodbclient](https://www.npmjs.com/package/@tomsd/mongodbclient) also.

![npm](https://img.shields.io/npm/v/@tomsd/mongodbclient?style=for-the-badge&logo=npm)
![NPM](https://img.shields.io/npm/l/@tomsd/mongodbclient?style=for-the-badge&logo=npm)

![ci](https://img.shields.io/github/actions/workflow/status/tomsdoo/mongodbclient/ci.yml?style=social&logo=github)
![checks](https://img.shields.io/github/check-runs/tomsdoo/mongodbclient/main?style=social&logo=github)
![top language](https://img.shields.io/github/languages/top/tomsdoo/mongodbclient?style=social&logo=typescript)
![Maintenance](https://img.shields.io/maintenance/yes/2025?style=social&logo=github)
![depends on mongodb@6](https://img.shields.io/badge/mongodb-mongodb@6-informational?style=social&logo=mongodb)
![depends on node greater or equal 18](https://img.shields.io/badge/node.js-%3E%3D%2018-lightyellow?style=social&logo=nodedotjs)

## installation
``` shell
npm install @tomsd/mongodbcliekt
```

## usage

[MClient](./mclient.md) is exported from the package.

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
