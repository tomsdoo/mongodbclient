const mongouri = "mongodb+srv://...";
const dbName = `db${(new Date()).getTime().toString()}`;
const collName = `col${(new Date()).getTime().toString()}`;

const assert = require("assert");
const MClient = require("../dist/cjs/mongodbclient.js").MClient;

const mdbc = new MClient(mongouri, dbName, collName);

const items = [
  {name:"alice"},
  {name:"bob"},
  {name:"charlie"},
  {name:"alice"}
];

describe("MClient", function(){
  it("insertMany()",function(done){
    mdbc.insertMany(items)
    .then(function(r){
      assert.equal(r.insertedCount, items.length);
      done();
    });
  });

  it("getCollections()", function(done){
    mdbc.getCollections()
    .then(function(collections){
      assert(collections.length > 0);
      done();
    });
  });

  it("read()", function(done){
    mdbc.read()
    .then(function(docs){
      assert.equal(docs.length, items.length);
      done();
    });
  });

  it("upsert()", function(done){
    mdbc.read()
    .then(function(docs){
      return mdbc.upsert({_id:docs[0]._id, name:"david"});
    })
    .then(function(r){
      assert.equal(r.modifiedCount, 1);
      done();
    });
  });

  it("distinct()", function(done){
    mdbc.distinct("name")
    .then(function(names){
      assert.equal(names.length, 4);
      done();
    });
  });

  it("stats()", function(done){
    mdbc.stats()
    .then(function(r){
      assert(r.storageSize > 0);
      done();
    });
  });

  it("count()", function(done){
    mdbc.count({name:"alice"})
    .then(function(n){
      assert.equal(n,1);
      done();
    });
  });

  it("remove()", function(done){
    mdbc.remove()
    .then(function(r){
      assert.equal(r.deletedCount, items.length);
      done();
    });
  });
});
