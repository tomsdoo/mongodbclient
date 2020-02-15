/**
 * @license mongodbclient
 * (c) 2020 tom
 * License: MIT
*/
const MongoClient = require("mongodb").MongoClient;
const rand = require("@tomsd/rand");

function getconnected(uri){return new Promise(function(resolve,reject){
  const client = new MongoClient(uri, {useUnifiedTopology: true});
  client.connect().then(resolve,reject);
});}

function c_getconnected(uri){return function(dbname,collectionname){return new Promise(function(resolve,reject){
  getconnected(uri).then(gotclient, reject);
  function gotclient(client){
    const db = client.db(dbname);
    const collection = db.collection(collectionname);
    resolve({client:client, db:db, collection:collection});
  }
});};}

function c_upsert(uri,db,collection){return function(pobj){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p);conn.client.close();};}
    pobj._id = pobj._id ? pobj._id : rand.id();
    conn.collection.updateOne({_id:pobj._id},{$set:pobj},{upsert:true,w:1}).then(c_fin(resolve), c_fin(reject));
  }
});};}

function c_read(uri,db,collection){return function(cond,opt){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.find(cond,opt).toArray().then(c_fin(resolve), c_fin(reject));
  }
});};}

function c_distinct(uri,db,collection){return function(key,cond){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.distinct(key,cond).then(c_fin(resolve),c_fin(reject));
  }
});};}

function c_remove(uri,db,collection){return function(cond){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.deleteMany(cond,{w:1}).then(c_fin(resolve),c_fin(reject));
  }
});};}

function c_stats(uri,db,collection){return function(){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.stats().then(c_fin(resolve), c_fin(reject));
  }
});};}

function c_count(uri,db,collection){return function(cond){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.countDocuments(cond).then(c_fin(resolve), c_fin(reject));
  }
});};}

function c_insertmany(uri,db,collection){return function(items){return new Promise(function(resolve,reject){
  c_getconnected(uri)(db,collection).then(coref, reject);
  function coref(conn){
    function c_fin(f){return function(p){f(p); conn.client.close();};}
    conn.collection.insertMany(items, {w:1}).then(resolve,reject);
  }
});};}

const MClient = function(uri,db,collection){
  this.write = c_upsert(uri,db,collection);
  this.read = c_read(uri,db,collection);
  this.distinct = c_distinct(uri,db,collection);
  this.remove = c_remove(uri,db,collection);
  this.stats = c_stats(uri,db,collection);
  this.count = c_count(uri,db,collection);
  this.insertMany = c_insertmany(uri,db,collection);
};

module.exports = {MClient:MClient};
