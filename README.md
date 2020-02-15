# @tomsd/mongodbclient

## Installation
``` sh
npm install @tomsd/mongodbclient
```

# Usage

``` js
const uri = "mongodb+srv://...";
const dbname = "mydb";
const collectionname = "mycollection";

const MClient = require("@tomsd/mongodbclient").MClient;

const mdbc = new MClient(uri, dbname, collectionname);

function log(message){console.log(message);}

mdbc.stats().then(log,log);

mdbc.write({"name":"value"}).then(log,log);

mdbc.read({"name":"value"}).then(log,log);

mdbc.count({"name":"value"}).then(log,log);

mdbc.distinct("name").then(log,log);

mdbc.insertMany([{"name":"value","test":1},{"name":"value","test":2}]).then(log,log);

mdbc.remove({"name":"value"}).then(log,log);

```
