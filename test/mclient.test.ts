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

  it("read()", async () => {
    const returningDocuments = [{ name: "test" }];
    const connection = {
      collection: {
        find: (condition: any) => ({
          toArray: async () => await Promise.resolve(returningDocuments),
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
      JSON.stringify(await mdbc.read({ name: "test" })),
      JSON.stringify(returningDocuments)
    );

    mocked.verify();
    mocked.restore();
  });

  it("distinct()", async () => {
    const returningValues = ["test1", "test2"];
    const connection = {
      collection: {
        distinct: async (key: string) => await Promise.resolve(returningValues),
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
      JSON.stringify(await mdbc.distinct("name")),
      JSON.stringify(returningValues)
    );

    mocked.verify();
    mocked.restore();
  });

  it("remove()", async () => {
    const returningValue = { deletedCount: 1 };
    const connection = {
      collection: {
        deleteMany: async (condition: any) =>
          await Promise.resolve(returningValue),
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
      JSON.stringify(await mdbc.remove({ name: "test" })),
      JSON.stringify(returningValue)
    );

    mocked.verify();
    mocked.restore();
  });

  it("stats()", async () => {
    const returningValue = { storageSize: 100 };
    const connection = {
      collection: {
        stats: async () => await Promise.resolve(returningValue),
      },
      client: {
        close: () => undefined,
      },
    };
    const mocked = mock(mdbc);
    mocked.expects("getConnected").once().withArgs().returns(connection);

    assert.equal(
      await mdbc.stats().then(({ storageSize }) => storageSize),
      100
    );

    mocked.verify();
    mocked.restore();
  });
});
