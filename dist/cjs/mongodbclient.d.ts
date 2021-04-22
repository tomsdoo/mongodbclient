/*!
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
*/
declare const MongoClient: any;
declare const Db: any;
export declare class MongoConnection {
    private _client;
    private _db;
    private _collection;
    constructor(client: typeof MongoClient, db: typeof Db, collection: any);
    get client(): typeof MongoClient;
    get db(): typeof Db;
    get collection(): any;
}
export declare class MClient {
    private m_uri;
    private m_db;
    private m_collection;
    constructor(uri: string, db: string, collection: string);
    get uri(): string;
    get db(): string;
    get collection(): string;
    connect(): Promise<MongoConnection>;
    protected getConnected(): Promise<MongoConnection>;
    upsert(pobj: any): Promise<unknown>;
    read(condition: any, opt?: any): Promise<unknown>;
    distinct(key: string, condition: any): Promise<unknown>;
    remove(condition: any): Promise<unknown>;
    stats(): Promise<unknown>;
    count(condition: any): Promise<number>;
    insertMany(items: any[]): Promise<unknown>;
    dbStats(): Promise<unknown>;
    getCollections(): Promise<any[]>;
}
export default MClient;
