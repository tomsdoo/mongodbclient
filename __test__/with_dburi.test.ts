import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MClient } from "../src/mongodbclient";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const mongouri = process.env.TEST_MONGODB_URI as string;
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
  let toBeSkipped: boolean;
  beforeEach(() => {
    toBeSkipped = process.env.TEST_MONGODB_URI == null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("insertMany()", async () => {
    if (toBeSkipped) {
      return;
    }
    const { insertedCount } = await mdbc.insertMany(items);
    expect(insertedCount).toBe(items.length);
  });

  it("getCollections()", async () => {
    if (toBeSkipped) {
      return;
    }
    const collections = await mdbc.getCollections();
    expect(collections).toSatisfy(
      (collections: any[]) => collections.length > 0,
    );
  });

  it("read()", async () => {
    if (toBeSkipped) {
      return;
    }
    const docs = await mdbc.read();
    const itemNames = items.map(({ name }) => name);
    expect(docs).toSatisfy((docs: Array<{ name: string }>) =>
      docs
        .filter(({ name }) => name)
        .map(({ name }) => name)
        .every((name) => itemNames.includes(name)),
    );
  });

  it("upsert()", async () => {
    if (toBeSkipped) {
      return;
    }
    const docs = await mdbc.read();
    const { modifiedCount } = await mdbc.upsert({
      _id: docs[0]._id,
      name: "david",
    });
    expect(modifiedCount).toBe(1);
  });

  it("distinct()", async () => {
    if (toBeSkipped) {
      return;
    }
    const names = await mdbc.distinct("name");
    expect(names).toHaveLength(4);
  });

  it("dbStats()", async () => {
    if (toBeSkipped) {
      return;
    }
    const { storageSize } = await mdbc.dbStats();
    expect(storageSize).toSatisfy((value: number) => value > 0);
  });

  it("stats()", async () => {
    if (toBeSkipped) {
      return;
    }
    const result = await mdbc.stats();
    expect(result).not.toBe(null);
    if (result != null) {
      const {
        storageStats: { storageSize },
      } = result;
      expect(storageSize).toSatisfy((value: number) => value > 0);
    }
  });

  it("count()", async () => {
    if (toBeSkipped) {
      return;
    }
    const n = await mdbc.count({ name: "alice" });
    expect(n).toBe(1);
  });

  it("remove()", async () => {
    if (toBeSkipped) {
      return;
    }
    const { deletedCount } = await mdbc.remove({});
    expect(deletedCount).toBe(items.length);
  });
});
