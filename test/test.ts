import { describe, it } from "mocha";
import { MClient } from "../src/mongodbclient";
import { strict as assert } from "assert";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const mongouri = process.env.MONGODB_URI as string;
const dbName = uuidv4();
const collName = uuidv4();

const mdbc = new MClient(mongouri, dbName, collName);

const items = [
  { name: "alice" },
  { name: "bob" },
  { name: "charlie" },
  { name: "alice" },
];

describe("MClient", () => {
  it("insertMany()", async () => {
    const { insertedCount } = await mdbc.insertMany(items);
    assert.equal(insertedCount, items.length);
  });

  it("getCollections()", async () => {
    const collections = await mdbc.getCollections();
    assert(collections.length > 0);
  });

  it("read()", async () => {
    const docs = await mdbc.read();
    const getNames = (items: any[]): string =>
      Array.from(new Set(items.map(({ name }) => name)))
        .sort((a,b) => a > b ? 1 : -1)
        .join("\n");
    assert.equal(getNames(docs), getNames(docs));
  });

  it("upsert()", async () => {
    const docs = await mdbc.read();
    const { modifiedCount } = await mdbc.upsert({
      _id: docs[0]._id,
      name: "david",
    });
    assert.equal(modifiedCount, 1);
  });

  it("distinct()", async () => {
    const names = await mdbc.distinct("name");
    assert.equal(names.length, 4);
  });

  it("dbStats()", async () => {
    const { storageSize } = await mdbc.dbStats();
    assert(storageSize > 0);
  });

  it("stats()", async () => {
    const { storageSize } = await mdbc.stats();
    assert(storageSize > 0);
  });

  it("count()", async () => {
    const n = await mdbc.count({ name: "alice" });
    assert.equal(n, 1);
  });

  it("remove()", async () => {
    const { deletedCount } = await mdbc.remove({});
    assert.equal(deletedCount, items.length);
  });
});
