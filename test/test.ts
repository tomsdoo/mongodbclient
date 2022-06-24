import {describe, it } from "mocha";
import { MClient } from "../src/mongodbclient";
import { strict as assert } from "assert";
import { v4 as uuidv4 } from "uuid";

const mongouri = "mongodb+srv://...";
const dbName = uuidv4();
const collName = uuidv4();

const mdbc = new MClient(mongouri, dbName, collName);

const items = [
  {name:"alice"},
  {name:"bob"},
  {name:"charlie"},
  {name:"alice"}
];

describe("MClient", () => {
  it("insertMany()", async () => {
    const { insertedCount } = (await mdbc.insertMany(items)) as { insertedCount: number };
    assert.equal(insertedCount, items.length);
  });

  it("getCollections()", async () => {
    const collections = await mdbc.getCollections();
    assert(collections.length > 0);
  });

  it("read()", async () => {
    const docs = (await mdbc.read({})) as any[];
    assert.equal(docs.length, items.length);
  });

  it("upsert()", async () => {
    const docs = (await mdbc.read({})) as any[];
    const { modifiedCount } = (await mdbc.upsert({ _id: docs[0]._id, name: "david" })) as { modifiedCount: number };
    assert.equal(modifiedCount, 1);
  });

  it("distinct()", async () => {
    const names = (await mdbc.distinct("name", {})) as string[];
    assert.equal(names.length, 4);
  });

  it("stats()", async () => {
    const { storageSize } = (await mdbc.stats()) as { storageSize: number };
    assert(storageSize > 0);
  });

  it("count()", async () => {
    const n = await mdbc.count({name:"alice"});
    assert.equal(n,1);
  });

  it("remove()", async () => {
    const { deletedCount } = (await mdbc.remove({})) as { deletedCount: number };
    assert.equal(deletedCount, items.length);
  });
});
