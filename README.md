# @tomsd/mongodbclient

## Installation
``` sh
npm install @tomsd/mongodbclient
```

# Usage

``` typescript
import { MClient } from "@tomsd/mongodbclient";

const uri = "mongodb+srv://...";
const dbname = "mydb";
const collectionname = "mycollection";

const mdbc = new MClient(uri, dbname, collectionname);

type Seed = {
  name: string;
};

type Entry = Seed & {
  _id: string;
};

const items: Seed[] = [
  { name: "alice" },
  { name: "bob" },
  { name: "charlie" },
  { name: "alice" }
];

mdbc.insertMany(items)
  .then((r: any) => {
    console.log(r.insertedCount); // 4
    return mdbc.getCollections();
  })
  .then((collections) => {
    console.log(
      collections.find(
        (collection: any) => collection.s.namespace.db === dbname
      )
    );
    return mdbc.read<Entry>();
  })
  .then((docs) => {
    console.log({
      docs,
      state: docs.length >= 4
    });
    return mdbc.upsert({
      _id:docs[0]._id,
      name:"david"
    });
  })
  .then((r: any) => {
    console.log(r.upsertedCount + r.modifiedCount);
    return mdbc.distinct("name", {});
  })
  .then((names) => {
    console.log(names);
    return mdbc.stats();
  })
  .then((r: any) => {
    console.log(r.storageSize);
    return mdbc.count({});
  })
  .then((n) => {
    console.log(n);
    return mdbc.remove({});
  })
  .then((r: any) => {
    console.log(r.deletedCount);
  })
  .catch((e) => {
    console.error(e);
  });

```
