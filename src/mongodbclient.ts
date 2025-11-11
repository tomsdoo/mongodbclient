import type {
  Collection,
  Db,
  DeleteResult,
  Document,
  Filter,
  FindOptions,
  InsertManyResult,
  OptionalId,
  UpdateResult,
  WithId,
} from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export class MongoConnection {
  private readonly _client: MongoClient;
  private readonly _db: Db;
  private readonly _collection: Collection;
  constructor(client: MongoClient, db: Db, collection: Collection) {
    this._client = client;
    this._db = db;
    this._collection = collection;
  }

  get client(): MongoClient {
    return this._client;
  }

  get db(): Db {
    return this._db;
  }

  get collection(): Collection {
    return this._collection;
  }
}

export class MClient {
  private readonly m_uri: string;
  private readonly m_db: string;
  private readonly m_collection: string;
  constructor(uri: string, db: string, collection: string) {
    this.m_uri = uri;
    this.m_db = db;
    this.m_collection = collection;
  }

  get uri(): string {
    return this.m_uri;
  }

  get db(): string {
    return this.m_db;
  }

  get collection(): string {
    return this.m_collection;
  }

  public async connect(): Promise<MongoConnection> {
    return await this.getConnected();
  }

  protected async getConnected(): Promise<MongoConnection> {
    const client = new MongoClient(this.m_uri, {
      serverApi: ServerApiVersion.v1,
    });
    return await client.connect().then((client) => {
      const db = client.db(this.m_db);
      const collection = db.collection(this.m_collection);
      return new MongoConnection(client, db, collection);
    });
  }

  public async upsert(pobj: any): Promise<UpdateResult> {
    const savingObj = {
      _id: uuidv4(),
      ...pobj,
    };
    const connection = await this.getConnected();
    try {
      return await connection.collection.updateOne(
        { _id: savingObj._id },
        { $set: savingObj },
        { upsert: true, writeConcern: { w: 1 } },
      );
    } finally {
      await connection.client.close();
    }
  }

  public async read<T = WithId<Document>>(
    condition: any = {},
    opt?: any,
  ): Promise<T[]> {
    const connection = await this.getConnected();
    try {
      return (await connection.collection
        .find(condition as Filter<Document>, opt as FindOptions | undefined)
        .toArray()) as unknown as T[];
    } finally {
      await connection.client.close();
    }
  }

  public async distinct<T = any>(
    key: string,
    condition: any = {},
  ): Promise<T[]> {
    const connection = await this.getConnected();
    try {
      return (await connection.collection.distinct(
        key,
        condition as Filter<Document>,
      )) as unknown as T[];
    } finally {
      await connection.client.close();
    }
  }

  public async remove(condition: any): Promise<DeleteResult> {
    const connection = await this.getConnected();
    try {
      return await connection.collection.deleteMany(
        condition as Filter<Document>,
        {
          writeConcern: { w: 1 },
        },
      );
    } finally {
      await connection.client.close();
    }
  }

  public async stats(): Promise<Document | null> {
    const connection = await this.getConnected();
    try {
      const [collStats] = await connection.collection
        .aggregate([
          {
            $collStats: {
              latencyStats: {
                histograms: true,
              },
              count: {},
              queryExecStats: {},
              storageStats: {
                scale: 1,
              },
            },
          },
        ])
        .toArray();
      return collStats;
    } catch (_) {
      return null;
    } finally {
      await connection.client.close();
    }
  }

  public async count(condition: any = {}): Promise<number> {
    const connection = await this.getConnected();
    try {
      return (await connection.collection.countDocuments(
        condition as Filter<Document>,
      )) as unknown as number;
    } finally {
      await connection.client.close();
    }
  }

  public async insertMany(items: any[]): Promise<InsertManyResult<Document>> {
    const connection = await this.getConnected();
    const savingItems = items.map((item) => ({
      _id: uuidv4(),
      ...item,
    }));
    try {
      return await connection.collection.insertMany(
        // biome-ignore lint: Array<T>
        savingItems as Array<OptionalId<Document>>,
        {
          writeConcern: { w: 1 },
        },
      );
    } finally {
      await connection.client.close();
    }
  }

  public async dbStats(): Promise<Document> {
    const connection = await this.getConnected();
    try {
      return await connection.db.stats();
    } finally {
      await connection.client.close();
    }
  }

  public async getCollections(): Promise<Collection[]> {
    const connection = await this.getConnected();
    try {
      return await connection.db.collections();
    } finally {
      await connection.client.close();
    }
  }
}

export default MClient;
