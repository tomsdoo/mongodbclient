import { describe, it } from "mocha";
import { MClient } from "../src/mongodbclient";
import { strict as assert } from "assert";

const testConfig = {
  uri: "mongodb+srv://...",
  db: "db",
  collection: "collection",
};
let mdbc: MClient;

describe("MClient", () => {
  before(() => {
    mdbc = new MClient(testConfig.uri, testConfig.db, testConfig.collection);
  });

  it("property uri", () => {
    assert.equal(mdbc.uri, testConfig.uri);
  });

  it("properti db", () => {
    assert.equal(mdbc.db, testConfig.db);
  });

  it("property collection", () => {
    assert.equal(mdbc.collection, testConfig.collection);
  });
});
