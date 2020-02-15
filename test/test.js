const assert = require("assert");

const def = {
  uri:"mongodb+srv://...",
  dbname:"testdb",
  collectionname:"mycollection"
};

const MClient = require("../src/mongodbclient.js").MClient;


const mdbc = new MClient(def.uri, def.dbname, def.collectionname);

describe("stats()",function(){
  it("stats() promises stat data", function(done){
    mdbc.stats().then(function(stat){
      assert(stat);
      done();
    },function(e){throw e;});
  });
});

describe("write()",function(){
  it("can write", function(done){
    mdbc.write({test:"test"}).then(function(ro){
      assert.equal(ro.result.ok,1);
      done();
    }, function(e){throw e;});
  });
});

describe("read()", function(){
  it("can read", function(done){
    mdbc.read({}).then(function(docs){
      assert(docs.length >= 0);
      done();
    }, function(e){throw e;});
  });
});

describe("distinct()", function(){
  it("can fetch", function(done){
    mdbc.distinct("test").then(function(values){
      assert(values.length >= 0);
      done();
    }, function(e){throw e;});
  });
});

describe("through", function(){
  const mykey = "a"+(new Date()).getTime();
  it("write()", function(done){
    mdbc.write({key:mykey}).then(function(ro){
      assert(ro.result.ok === 1);
      done();
    }, function(e){throw e;});
  });
  it("read()", function(done){
    mdbc.read({key:mykey}).then(function(docs){
      assert(docs.length === 1);
      done();
    }, function(e){throw e;});
  });
  it("count()", function(done){
    mdbc.count({key:mykey}).then(function(rcount){
      assert.equal(rcount,1);
      done();
    }, function(e){throw e;});
  });
  it("remove()", function(done){
    mdbc.remove({key:mykey}).then(function(ro){
      assert(ro.result.n === 1);
      done();
    }, function(e){throw e;});
  });
  it("insertMany()", function(done){
    const items = [0,1,2,3,4].map(function(i){return {key:mykey, n:i};});
    mdbc.insertMany(items).then(function(ro){
      assert(ro.result.n === items.length);
      done();
    },function(e){throw e;});
  });
  it("remove()", function(done){
    mdbc.remove({key:mykey}).then(function(ro){
      assert(ro.result.n === 5);
      done();
    }, function(e){throw e;});
  });
});
