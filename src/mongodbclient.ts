/*!
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
*/
const MongoClient = require("mongodb").MongoClient;
const Db = require("mongodb").Db;

const {Collection, UpdateWriteOpResult, deleteWriteOpResult, insertWriteOpResult} = require("mongodb");
const rand = require("@tomsd/rand").default;

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
  protected getConnected(){
    const that = this;
    const client = new MongoClient(that.m_uri, {useUnifiedTopology:true});
    return new Promise<MongoConnection>(function(resolve,reject){
      client.connect()
      .then(function(client: typeof MongoClient){
        const db = client.db(that.m_db);
        const collection = db.collection(that.m_collection);
        resolve(new MongoConnection(client, db, collection));
      })
      .catch(function(e:Error){
        reject(e);
      });
    });
  }
  public upsert(pobj:any){
    const that = this;
    pobj._id = "_id" in pobj ? pobj._id : rand.id(rand.char());
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.updateOne({_id:pobj._id},{$set:pobj},{upsert:true,w:1})
        .then(function(r:typeof UpdateWriteOpResult){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      },reject);
    });
  }
  public read(condition:any,opt?:any){
    const that = this;
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.find(condition, opt)
        .toArray()
        .then(function(docs : any[]){
          conn.client.close();
          resolve(docs);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      });
    });
  }
  public distinct(key:string, condition:any){
    const that = this;
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.distinct(key,condition)
        .then(function(values:any[]){
          conn.client.close();
          resolve(values);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      });
    });
  }
  public remove(condition:any){
    const that = this;
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.deleteMany(condition, {w:1})
        .then(function(r:typeof deleteWriteOpResult){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      },reject);
    });
  }
  public stats(){
    const that = this;
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.stats()
        .then(function(r:any){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      }, reject);
    });
  }
  public count(condition:any){
    const that = this;
    return new Promise<number>(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.countDocuments(condition)
        .then(function(r:number){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      },reject);
    });
  }
  public insertMany(items:any[]){
    const that = this;
    items.forEach(function(item){
      item._id = item._id ? item._id : rand.id(rand.char());
    });
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.collection.insertMany(items, {w:1})
        .then(function(r:typeof insertWriteOpResult){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      },reject);
    });
  }
  public dbStats(){
    const that = this;
    return new Promise(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.db.stats()
        .then(function(r:any){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      }, reject);
    });
  }
  public getCollections(){
    const that = this;
    return new Promise<(typeof Collection)[]>(function(resolve,reject){
      that.getConnected()
      .then(function(conn){
        conn.db.collections()
        .then(function(r:any){
          conn.client.close();
          resolve(r);
        })
        .catch(function(e:Error){
          conn.client.close();
          reject(e);
        });
      },reject);
    });
  }
}

export default MClient;
