/*!
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
 */
import {
  Db,
  Collection,
  CollStats,
  DeleteResult,
  Document,
  InsertManyResult,
  UpdateResult,
  WithId,
} from "mongodb";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoClient = require("mongodb").MongoClient;

export class MongoConnection {
  private readonly _client: typeof MongoClient;
  private readonly _db: Db;
  private readonly _collection: Collection;
  constructor(client: typeof MongoClient, db: Db, collection: Collection) {
    this._client = client;
    this._db = db;
    this._collection = collection;
  }

  get client(): typeof MongoClient {
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
    const client = new MongoClient(this.m_uri, { useUnifiedTopology: true });
    return client.connect().then((client: typeof MongoClient) => {
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
        { upsert: true, writeConcern: { w: 1 } }
      );
    } finally {
      connection.client.close();
    }
  }

  public async read(
    condition: any = {},
    opt?: any
  ): Promise<Array<WithId<Document>>> {
    const connection = await this.getConnected();
    try {
      return await connection.collection.find(condition, opt).toArray();
    } finally {
      connection.client.close();
    }
  }

  public async distinct(key: string, condition: any = {}): Promise<any[]> {
    const connection = await this.getConnected();
    try {
      return (await connection.collection.distinct(
        key,
        condition
      )) as unknown as any[];
    } finally {
      connection.client.close();
    }
  }

  public async remove(condition: any): Promise<DeleteResult> {
    const connection = await this.getConnected();
    try {
      return await connection.collection.deleteMany(condition, {
        writeConcern: { w: 1 },
      });
    } finally {
      connection.client.close();
    }
  }

  public async stats(): Promise<CollStats> {
    const connection = await this.getConnected();
    try {
      return await connection.collection.stats();
    } finally {
      connection.client.close();
    }
  }

  public async count(condition: any = {}): Promise<number> {
    const connection = await this.getConnected();
    try {
      return (await connection.collection.countDocuments(
        condition
      )) as unknown as number;
    } finally {
      connection.client.close();
    }
  }

  public async insertMany(items: any[]): Promise<InsertManyResult<Document>> {
    const connection = await this.getConnected();
    const savingItems = items.map((item) => ({
      _id: uuidv4(),
      ...item,
    }));
    try {
      return await connection.collection.insertMany(savingItems, {
        writeConcern: { w: 1 },
      });
    } finally {
      connection.client.close();
    }
  }

  public async dbStats(): Promise<Document> {
    const connection = await this.getConnected();
    try {
      return await connection.db.stats();
    } finally {
      connection.client.close();
    }
  }

  public async getCollections(): Promise<Collection[]> {
    const connection = await this.getConnected();
    try {
      return await connection.db.collections();
    } finally {
      connection.client.close();
    }
  }
}

export default MClient;
