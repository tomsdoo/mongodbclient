import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { MClient, type MongoConnection } from "../src/mongodbclient";

const testConfig = {
  uri: "mongodb+srv://...",
  db: "db",
  collection: "collection",
};

class ExtendedMClient extends MClient {
  public async getConnected(): Promise<MongoConnection> {
    return await super.getConnected();
  }
}

let mdbc: ExtendedMClient;

vi.mock("uuid", () => ({
  v4: () => "dummyUuid",
}));

describe("MClient", () => {
  beforeEach(() => {
    mdbc = new ExtendedMClient(
      testConfig.uri,
      testConfig.db,
      testConfig.collection,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("property uri", () => {
    expect(mdbc).toHaveProperty("uri", testConfig.uri);
  });

  it("properti db", () => {
    expect(mdbc).toHaveProperty("db", testConfig.db);
  });

  it("property collection", () => {
    expect(mdbc).toHaveProperty("collection", testConfig.collection);
  });

  it("upsert()", async () => {
    const spyUpdateOne = vi.fn(
      async () =>
        await Promise.resolve({
          upsertedCount: 1,
          modifiedCount: 0,
        }),
    );
    const connection = {
      collection: {
        updateOne: spyUpdateOne,
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);

    await mdbc.upsert({ name: "test" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyUpdateOne).toHaveBeenCalledWith(
      {
        _id: "dummyUuid",
      },
      {
        $set: {
          _id: "dummyUuid",
          name: "test",
        },
      },
      { upsert: true, writeConcern: { w: 1 } },
    );
  });

  it("read()", async () => {
    const returningDocuments = [{ name: "test" }];
    const spyFindToArray = vi.fn(
      async () => await Promise.resolve(returningDocuments),
    );
    const connection = {
      collection: {
        find: (condition: any) => ({
          toArray: spyFindToArray,
        }),
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);

    await mdbc.read({ name: "test" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyFindToArray).toHaveBeenCalledTimes(1);
  });

  it("distinct()", async () => {
    const returningValues = ["test1", "test2"];
    const spyDistinct = vi.fn(
      async () => await Promise.resolve(returningValues),
    );
    const connection = {
      collection: {
        distinct: spyDistinct,
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.distinct("name");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyDistinct).toHaveBeenCalledWith("name", {});
  });

  it("remove()", async () => {
    const returningValue = { deletedCount: 1 };
    const spyDeleteMany = vi.fn(
      async () => await Promise.resolve(returningValue),
    );
    const connection = {
      collection: {
        deleteMany: spyDeleteMany,
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.remove({ name: "test" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyDeleteMany).toHaveBeenCalledWith(
      { name: "test" },
      { writeConcern: { w: 1 } },
    );
  });

  it("stats()", async () => {
    const returningValue = { storageStats: { storageSize: 100 } };
    const spyAggregate = vi.fn(
      async () => await Promise.resolve(returningValue),
    );
    const connection = {
      collection: {
        aggregate: spyAggregate,
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.stats();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyAggregate).toHaveBeenCalledWith([
      {
        $collStats: {
          latencyStats: {
            histograms: true,
          },
          count: {},
          queryExecStats: {},
          storageStats: { scale: 1 },
        },
      },
    ]);
  });

  it("count()", async () => {
    const resultValue = 100;
    const spyCountDocuments = vi.fn(
      async () => await Promise.resolve(resultValue),
    );
    const connection = {
      collection: {
        countDocuments: spyCountDocuments,
      },
      client: {
        close: () => undefined,
      },
    };
    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.count({ name: "test" });
    expect(spy).toHaveBeenCalledWith();
    expect(spyCountDocuments).toHaveBeenCalledWith({ name: "test" });
  });

  it("insertMany()", async () => {
    const insertingItems = [
      { name: "test1" },
      { name: "test2" },
      { name: "test3" },
    ];
    const spyInsertMany = vi.fn(
      async (savingItems: any[]) =>
        await Promise.resolve({
          insertedCount: savingItems.length,
        }),
    );
    const connection = {
      collection: {
        insertMany: spyInsertMany,
      },
      client: {
        close: () => undefined,
      },
    };

    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.insertMany(insertingItems);
    expect(spy).toHaveBeenCalledWith();
    expect(spyInsertMany).toHaveBeenCalledWith(
      insertingItems.map((item) => ({
        ...item,
        _id: "dummyUuid",
      })),
      { writeConcern: { w: 1 } },
    );
  });

  it("dbStats()", async () => {
    const resultValue = { storageSize: 100 };
    const spyStats = vi.fn(async () => await Promise.resolve(resultValue));
    const connection = {
      db: {
        stats: spyStats,
      },
      client: {
        close: () => undefined,
      },
    };

    const spy = vi
      .spyOn(mdbc, "getConnected")
      .mockResolvedValue(connection as unknown as MongoConnection);
    await mdbc.dbStats();
    expect(spy).toHaveBeenCalledWith();
    expect(spyStats).toHaveBeenCalledWith();
  });
});
