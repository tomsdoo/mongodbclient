"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MClient = exports.MongoConnection = void 0;
/*!
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
*/
const MongoClient = require("mongodb").MongoClient;
const Db = require("mongodb").Db;
const { Collection, UpdateWriteOpResult, deleteWriteOpResult, insertWriteOpResult } = require("mongodb");
const rand = require("@tomsd/rand").default;
class MongoConnection {
    constructor(client, db, collection) {
        this._client = client;
        this._db = db;
        this._collection = collection;
    }
    get client() {
        return this._client;
    }
    get db() {
        return this._db;
    }
    get collection() {
        return this._collection;
    }
}
exports.MongoConnection = MongoConnection;
class MClient {
    constructor(uri, db, collection) {
        this.m_uri = uri;
        this.m_db = db;
        this.m_collection = collection;
    }
    get uri() {
        return this.m_uri;
    }
    get db() {
        return this.m_db;
    }
    get collection() {
        return this.m_collection;
    }
    connect() {
        return this.getConnected();
    }
    getConnected() {
        const that = this;
        const client = new MongoClient(that.m_uri, { useUnifiedTopology: true });
        return new Promise(function (resolve, reject) {
            client.connect()
                .then(function (client) {
                const db = client.db(that.m_db);
                const collection = db.collection(that.m_collection);
                resolve(new MongoConnection(client, db, collection));
            })
                .catch(function (e) {
                reject(e);
            });
        });
    }
    upsert(pobj) {
        const that = this;
        pobj._id = "_id" in pobj ? pobj._id : rand.id(rand.char());
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.updateOne({ _id: pobj._id }, { $set: pobj }, { upsert: true, w: 1 })
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    read(condition, opt) {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.find(condition, opt)
                    .toArray()
                    .then(function (docs) {
                    conn.client.close();
                    resolve(docs);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            });
        });
    }
    distinct(key, condition) {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.distinct(key, condition)
                    .then(function (values) {
                    conn.client.close();
                    resolve(values);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            });
        });
    }
    remove(condition) {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.deleteMany(condition, { w: 1 })
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    stats() {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.stats()
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    count(condition) {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.countDocuments(condition)
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    insertMany(items) {
        const that = this;
        items.forEach(function (item) {
            item._id = item._id ? item._id : rand.id(rand.char());
        });
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.collection.insertMany(items, { w: 1 })
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    dbStats() {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.db.stats()
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
    getCollections() {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.getConnected()
                .then(function (conn) {
                conn.db.collections()
                    .then(function (r) {
                    conn.client.close();
                    resolve(r);
                })
                    .catch(function (e) {
                    conn.client.close();
                    reject(e);
                });
            }, reject);
        });
    }
}
exports.MClient = MClient;
exports.default = MClient;
