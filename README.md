# @tomsd/mongodbclient

## Installation
``` sh
npm install @tomsd/mongodbclient
```

# Usage

``` js
const uri = "mongodb+srv://...";
const dbname = "mydb";
const collectionname = "mycollection";

const MClient = require("@tomsd/mongodbclient").MClient;

const mdbc = new MClient(uri, dbname, collectionname);

const items = [
  {name:"alice"},
  {name:"bob"},
  {name:"charlie"},
  {name:"alice"}
];

mdbc.insertMany(items)
.then((r) => {
  console.log(r.insertedCount); // 4
  return mdbc.getCollections();
})
.then((collections) => {
  console.log(collections.some((collection) => collection.s.namespace.db === dbname));
  return mdbc.read();
})
.then((docs) => {
  console.log(docs.length >= 4);
  return mdbc.upsert({_id:docs[0]._id, name:"david"});
})
.then((r) => {
  console.log(r.upsertedCount + r.modifiedCount);
  return mdbc.distinct("name");
})
.then((names) => {
  console.log(names);
  return mdbc.stats();
})
.then((r) => {
  console.log(r.storageSize);
  return mdbc.count();
})
.then((n) => {
  console.log(n);
  return mdbc.remove();
})
.then((r) => {
  console.log(r.deletedCount);
})
.catch((e) => {
  console.error(e);
});


```
