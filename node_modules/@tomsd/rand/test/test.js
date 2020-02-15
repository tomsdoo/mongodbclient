import rand from "../src/rand.js";
const assert = require("assert");

const loweralphabets = "abcdefghijklmnopqrstuvwxyz";

describe("char()",function(){
  it("char() returns 1 length string", function(){
    assert.equal(rand.char().length, 1);
  });
  it("char() returns a character", function(){
    assert(loweralphabets.indexOf(rand.char()) >= 0);
  });
});

describe("str()", function(){
  it("str() returns 5 length string as default", function(){
    assert.equal(rand.str().length, 5);
  });
  it("str() returns some characters", function(){
    assert(rand.str().split("").every(function(c){return loweralphabets.indexOf(c) >= 0;}));
  });
  it("str() returns string that has the length as parameter number", function(){
    const mylength = 10;
    assert.equal(rand.str(mylength).length, mylength);
  });
});

describe("id()", function(){
  it("id() returns not same as before", function(){
    const ids = [0,1].map(function(){return rand.id();});
    assert(ids[0] !== ids[1]);
  });
  it("id() returns string that starts with the parameter", function(){
    const mystartstr = "teststart";
    assert.equal(rand.id(mystartstr).slice(0,mystartstr.length), mystartstr);
  });
});
