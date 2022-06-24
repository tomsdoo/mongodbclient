const mongouri = "mongodb+srv://...";
const dbName = `db${(new Date()).getTime().toString()}`;
const collName = `col${(new Date()).getTime().toString()}`;

const assert = require("assert");
const MClient = require("../dist/cjs/mongodbclient.js").MClient;

const mdbc = new MClient(mongouri, dbName, collName);

const items = [
  {name:"alice"},
  {name:"bob"},
  {name:"charlie"},
  {name:"alice"}
];

describe("MClient", () => {
  it("insertMany()", async () => {
    const { insertedCount } = await mdbc.insertMany(items)
    assert.equal(insertedCount, items.length);
  });

  it("getCollections()", async () => {
    const collections = await mdbc.getCollections();
    assert(collections.length > 0);
  });

  it("read()", async () => {
    const docs = await mdbc.read();
    assert.equal(docs.length, items.length);
  });

  it("upsert()", async () => {
    const docs = await mdbc.read();
    const { modifiedCount } = await mdbc.upsert({ _id: docs[0]._id, name: "david" });
    assert.equal(modifiedCount, 1);
  });

  it("distinct()", async () => {
    const names = await mdbc.distinct("name");
    assert.equal(names.length, 4);
  });

  it("stats()", async () => {
    const { storageSize } = await mdbc.stats();
    assert(storageSize > 0);
  });

  it("count()", async () => {
    const n = await mdbc.count({name:"alice"});
    assert.equal(n,1);
  });

  it("remove()", async () => {
    const { deletedCount } = await mdbc.remove();
    assert.equal(deletedCount, items.length);
  });
});
