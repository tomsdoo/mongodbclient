import { describe, it } from "mocha";
import { MClient } from "../src/mongodbclient";
import { strict as assert } from "assert";
import { mock } from "sinon";

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

  it("upsert()", async () => {
    const connection = {
      collection: {
        updateOne: async (obj: any) =>
          await Promise.resolve({
            upsertedCount: 1,
            modifiedCount: 0,
          }),
      },
      client: {
        close: () => undefined,
      },
    };
    const mocked = mock(mdbc);
    mocked
      .expects("getConnected")
      .once()
      .withArgs()
      .returns(Promise.resolve(connection));

    assert.equal(
      await mdbc
        .upsert({ name: "test" })
        .then(({ upsertedCount }) => upsertedCount),
      1
    );

    mocked.verify();
    mocked.restore();
  });
});
