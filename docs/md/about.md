# @tomsd/mongodbclient

It's a handy mongodb client for easy-use.  
See [npm @tomsd/mongodbclient](https://www.npmjs.com/package/@tomsd/mongodbclient) also.

![npm](https://img.shields.io/npm/v/@tomsd/mongodbclient)
![NPM](https://img.shields.io/npm/l/@tomsd/mongodbclient)
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/@tomsd/mongodbclient)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@tomsd/mongodbclient)
![Maintenance](https://img.shields.io/maintenance/yes/2022)
![depends on mongodb@4](https://img.shields.io/badge/depends%20on-mongodb@4-informational)

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
