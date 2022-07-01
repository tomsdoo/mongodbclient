/*!
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
*/
const MongoClient = require("mongodb").MongoClient;
const Db = require("mongodb").Db;

const {Collection, UpdateWriteOpResult, deleteWriteOpResult, insertWriteOpResult} = require("mongodb");
import { v4 as uuidv4 } from "uuid";

export class MongoConnection {
  private _client: typeof MongoClient;
  private _db: typeof Db;
  private _collection:typeof Collection;
  constructor(client : typeof MongoClient, db : typeof Db, collection : any ){
    this._client = client;
    this._db = db;
    this._collection = collection;
  }
  get client() : typeof MongoClient{
    return this._client;
  }
  get db() : typeof Db{
    return this._db;
  }
  get collection() :any {
    return this._collection;
  }
}

export class MClient {
  private m_uri:string;
  private m_db:string;
  private m_collection:string;
  constructor(uri:string, db:string, collection:string){
    this.m_uri = uri;
    this.m_db = db;
    this.m_collection = collection;
  }
  get uri() : string {
    return this.m_uri;
  }
  get db() : string {
    return this.m_db;
  }
  get collection() : string {
    return this.m_collection;
  }
  public connect(){
    return this.getConnected();
  }
  protected async getConnected(){
    const client = new MongoClient(this.m_uri, {useUnifiedTopology:true});
    return client
      .connect()
      .then((client: typeof MongoClient) => {
        const db = client.db(this.m_db);
        const collection = db.collection(this.m_collection);
        return new MongoConnection(client, db, collection);
      });
  }
  public async upsert(pobj:any){
    const savingObj = {
      _id: uuidv4(),
      ...pobj
    };
    const connection = await this.getConnected();
    try{
      return await connection.collection.updateOne(
        { _id: savingObj._id },
        { $set: savingObj },
        { upsert: true, writeConcern: { w: 1 } }
      );
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async read(condition: any = {}, opt?:any){
    const connection = await this.getConnected();
    try{
      return await connection
        .collection
        .find(condition, opt)
        .toArray();
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async distinct(key:string, condition:any = {}){
    const connection = await this.getConnected();
    try{
      return await connection.collection.distinct(key, condition);
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async remove(condition:any){
    const connection = await this.getConnected();
    try{
      return await connection.collection.deleteMany(condition, { writeConcern: { w: 1} });
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async stats(){
    const connection = await this.getConnected();
    try{
      return await connection.collection.stats();
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async count(condition:any = {}): Promise<number>{
    const connection = await this.getConnected();
    try{
      return await connection.collection.countDocuments(condition);
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async insertMany(items:any[]){
    const connection = await this.getConnected();
    const savingItems = items.map(item => ({
      _id: uuidv4(),
      ...item
    }));
    try{
      return await connection.collection
        .insertMany(
          savingItems,
          { writeConcern: {w: 1}}
        );
    }catch(e){
      throw e;
    }
    finally{
      connection.client.close();
    }
  }
  public async dbStats(){
    const connection = await this.getConnected();
    try{
      return await connection.db.stats();
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
  public async getCollections(){
    const connection = await this.getConnected();
    try{
      return await connection.db.collections();
    }catch(e){
      throw e;
    }finally{
      connection.client.close();
    }
  }
}

export default MClient;
